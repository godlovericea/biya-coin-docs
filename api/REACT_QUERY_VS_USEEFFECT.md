# React Query vs useEffect：为什么要替换数据获取方式？

> **文档目的**: 深入解释为什么在数据获取场景下，React Query 比传统的 useEffect 方式更优秀  
> **适用读者**: React 开发者，特别是习惯使用 useEffect 进行数据获取的开发者  
> **阅读时间**: 15-20 分钟  
> **更新日期**: 2025-11-05

---

## 📑 目录

1. [核心观点](#核心观点)
2. [useEffect 的 7 个严重问题](#useeffect-的-7-个严重问题)
3. [React Query 如何解决这些问题](#react-query-如何解决这些问题)
4. [实际项目对比](#实际项目对比)
5. [性能和体验提升](#性能和体验提升)
6. [何时仍需要 useEffect](#何时仍需要-useeffect)
7. [迁移指南](#迁移指南)
8. [常见问题解答](#常见问题解答)

---

## 核心观点

### 🎯 一句话总结

**useEffect 是为副作用设计的，不是为数据获取设计的。React Query 是专门为数据获取设计的，解决了 useEffect 在数据获取场景下的所有痛点。**

### 📊 关键数据

- **代码量减少**: 70-90%
- **Bug 减少**: 约 60-70%（避免竞态条件、内存泄漏等）
- **性能提升**: 请求去重 + 智能缓存
- **开发效率**: 提升 3-5 倍
- **用户体验**: 显著改善（更快的响应、更少的闪烁）

---

## useEffect 的 7 个严重问题

### 问题 1: 代码冗长，样板代码过多 📝

#### ❌ 使用 useEffect 的传统方式

```typescript
function UserDashboard() {
  // 状态管理 - 需要 3 个状态
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // 防止内存泄漏的标志
    let cancelled = false
    
    // 设置加载状态
    setLoading(true)
    setError(null)
    
    // 发起请求
    fetchUserData()
      .then(result => {
        // 检查是否已取消
        if (!cancelled) {
          setData(result)
          setError(null)
        }
      })
      .catch(err => {
        // 检查是否已取消
        if (!cancelled) {
          setError(err.message)
          setData(null)
        }
      })
      .finally(() => {
        // 检查是否已取消
        if (!cancelled) {
          setLoading(false)
        }
      })

    // 清理函数 - 防止内存泄漏
    return () => {
      cancelled = true
    }
  }, []) // 空依赖数组

  // 渲染逻辑
  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />
  if (!data) return null

  return <div>{/* 渲染数据 */}</div>
}
```

**代码行数**: ~45 行  
**需要管理**: 3 个状态变量 + 1 个取消标志 + 清理逻辑

---

#### ✅ 使用 React Query 的方式

```typescript
function UserDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['userData'],
    queryFn: fetchUserData,
  })

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />

  return <div>{/* 渲染数据 */}</div>
}
```

**代码行数**: ~10 行  
**代码减少**: 78% ⬇️  
**自动处理**: 缓存、取消、错误、加载状态

---

### 问题 2: 竞态条件（Race Condition）🐛

这是 useEffect 最严重的 Bug 之一，也是最容易被忽视的。

#### 什么是竞态条件？

当用户快速操作（如快速切换选项卡），多个异步请求同时进行，响应顺序可能与请求顺序不一致，导致显示错误的数据。

#### ❌ useEffect 的竞态问题示例

```typescript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    
    // 🐛 BUG: 没有取消机制
    fetchUser(userId)
      .then(data => {
        setUser(data)
        setLoading(false)
      })
  }, [userId])

  return <div>{user?.name}</div>
}
```

**问题场景：**
```
时间线：
t=0ms    用户点击 userId=1 → 发送请求1 (需要 500ms)
t=100ms  用户点击 userId=2 → 发送请求2 (需要 200ms)
t=200ms  用户点击 userId=3 → 发送请求3 (需要 100ms)

响应顺序（根据网络延迟）：
t=300ms  请求3返回 → setUser(user3) ✅
t=300ms  请求2返回 → setUser(user2) ❌ 覆盖了 user3
t=500ms  请求1返回 → setUser(user1) ❌ 覆盖了 user2

最终结果：显示 user1 的数据 ❌
期望结果：显示 user3 的数据 ✅
```

#### 尝试修复（但仍不完美）

```typescript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    let cancelled = false // 添加取消标志

    fetchUser(userId).then(data => {
      if (!cancelled) { // 检查是否取消
        setUser(data)
      }
    })

    return () => {
      cancelled = true // 组件卸载或 userId 变化时取消
    }
  }, [userId])

  return <div>{user?.name}</div>
}
```

**问题：**
1. 虽然避免了设置状态，但请求仍在进行（浪费带宽）
2. 需要在每个组件中重复这个逻辑
3. 容易忘记添加取消逻辑
4. 如果使用 axios，需要额外的 CancelToken 逻辑

---

#### ✅ React Query 的解决方案

```typescript
function UserProfile({ userId }) {
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  })

  return <div>{user?.name}</div>
}
```

**React Query 如何解决：**
1. ✅ 自动取消过期的请求（真正的网络层取消）
2. ✅ 通过 queryKey 管理请求唯一性
3. ✅ 保证只显示最新 queryKey 对应的数据
4. ✅ 零额外代码

---

### 问题 3: 重复请求和缓存缺失 🔄

#### ❌ useEffect 的重复请求问题

```typescript
// 场景：Dashboard 和 Sidebar 同时需要用户列表

// Dashboard 组件
function Dashboard() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchUsers().then(setUsers) // 请求1
  }, [])

  return <UserList users={users} />
}

// Sidebar 组件（同时渲染）
function Sidebar() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchUsers().then(setUsers) // 请求2（重复！）
  }, [])

  return <UserCount count={users.length} />
}
```

**问题：**
1. 发送了 2 次相同的请求（浪费带宽）
2. 用户看到两次加载状态
3. 数据可能不一致（两次请求之间数据可能变化）

**尝试手动缓存（复杂且容易出错）：**

```typescript
// 需要创建全局缓存
const cache = new Map()

function useFetchUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // 检查缓存
    if (cache.has('users')) {
      setUsers(cache.get('users'))
      return
    }

    // 发起请求
    setLoading(true)
    fetchUsers().then(data => {
      cache.set('users', data) // 存入缓存
      setUsers(data)
      setLoading(false)
    })
  }, [])

  return { users, loading }
}
```

**新问题：**
1. 何时更新缓存？
2. 缓存何时过期？
3. 如何清除缓存？
4. 多个参数如何作为缓存 key？
5. 需要手动管理缓存生命周期

---

#### ✅ React Query 的自动缓存

```typescript
// Dashboard 组件
function Dashboard() {
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })

  return <UserList users={users} />
}

// Sidebar 组件
function Sidebar() {
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers, // ✅ 不会发送请求！使用缓存
  })

  return <UserCount count={users?.length || 0} />
}
```

**React Query 的智能缓存：**
1. ✅ 自动去重 - 相同 queryKey 只发送一次请求
2. ✅ 自动缓存 - 数据存储在内存中
3. ✅ 自动过期 - 可配置 staleTime
4. ✅ 自动重新验证 - 过期后自动刷新
5. ✅ 零配置 - 开箱即用

---

### 问题 4: 加载状态管理复杂 🎛️

#### ❌ 多个数据源的状态管理噩梦

```typescript
function ComplexDashboard() {
  // 用户数据
  const [users, setUsers] = useState(null)
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState(null)

  // 订单数据
  const [orders, setOrders] = useState(null)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState(null)

  // 产品数据
  const [products, setProducts] = useState(null)
  const [productsLoading, setProductsLoading] = useState(false)
  const [productsError, setProductsError] = useState(null)

  // 统计数据
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(false)
  const [statsError, setStatsError] = useState(null)

  useEffect(() => {
    setUsersLoading(true)
    fetchUsers()
      .then(setUsers)
      .catch(setUsersError)
      .finally(() => setUsersLoading(false))
  }, [])

  useEffect(() => {
    setOrdersLoading(true)
    fetchOrders()
      .then(setOrders)
      .catch(setOrdersError)
      .finally(() => setOrdersLoading(false))
  }, [])

  useEffect(() => {
    setProductsLoading(true)
    fetchProducts()
      .then(setProducts)
      .catch(setProductsError)
      .finally(() => setProductsLoading(false))
  }, [])

  useEffect(() => {
    setStatsLoading(true)
    fetchStats()
      .then(setStats)
      .catch(setStatsError)
      .finally(() => setStatsLoading(false))
  }, [])

  // 😵 需要协调所有状态
  const isLoading = usersLoading || ordersLoading || productsLoading || statsLoading
  const hasError = usersError || ordersError || productsError || statsError

  // 😵 组件有 12 个状态变量！
}
```

**问题：**
- 12 个状态变量（数据 + 加载 + 错误）× 4
- 4 个 useEffect
- 难以维护
- 容易出错

---

#### ✅ React Query 的优雅方案

```typescript
function ComplexDashboard() {
  const users = useQuery({ queryKey: ['users'], queryFn: fetchUsers })
  const orders = useQuery({ queryKey: ['orders'], queryFn: fetchOrders })
  const products = useQuery({ queryKey: ['products'], queryFn: fetchProducts })
  const stats = useQuery({ queryKey: ['stats'], queryFn: fetchStats })

  // ✅ 清晰简洁
  const isLoading = users.isLoading || orders.isLoading || products.isLoading || stats.isLoading
  const hasError = users.error || orders.error || products.error || stats.error

  // 每个查询独立管理，但可以组合
}
```

**优势：**
- 4 行查询代码
- 每个查询独立
- 易于组合和条件化
- 类型安全

---

### 问题 5: 窗口聚焦时数据过期 🪟

#### ❌ useEffect 不会自动刷新

```typescript
function StockPrice() {
  const [price, setPrice] = useState(null)

  useEffect(() => {
    fetchStockPrice().then(setPrice)
  }, [])

  return <div>当前价格: ${price}</div>
}
```

**用户场景：**
```
1. 用户打开股票页面，看到价格 $100
2. 用户切换到邮件标签页工作 10 分钟
3. 这期间股票涨到 $150
4. 用户切回来，仍然看到 $100 ❌
```

**尝试修复：**

```typescript
function StockPrice() {
  const [price, setPrice] = useState(null)

  useEffect(() => {
    fetchStockPrice().then(setPrice)
  }, [])

  // 需要手动添加焦点监听
  useEffect(() => {
    const handleFocus = () => {
      fetchStockPrice().then(setPrice)
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  return <div>当前价格: ${price}</div>
}
```

**问题：**
- 每次聚焦都刷新（即使数据刚获取）
- 需要在每个组件重复这个逻辑

---

#### ✅ React Query 的智能刷新

```typescript
function StockPrice() {
  const { data: price } = useQuery({
    queryKey: ['stockPrice'],
    queryFn: fetchStockPrice,
    staleTime: 2 * 60 * 1000, // 2分钟内认为数据新鲜
    refetchOnWindowFocus: true, // ✅ 默认开启
  })

  return <div>当前价格: ${price}</div>
}
```

**智能刷新逻辑：**
```
1. 用户打开页面 → 获取价格
2. 用户切走 → 数据在 2 分钟内认为是新鲜的
3. 2 分钟后用户回来 → 自动刷新（数据已过期）
4. 2 分钟内用户回来 → 不刷新（数据仍然新鲜）
```

---

### 问题 6: 乐观更新困难 ⚡

乐观更新是指：先更新 UI，再发送请求，如果失败则回滚。这能极大提升用户体验。

#### ❌ useEffect 实现乐观更新（复杂）

```typescript
function TodoList() {
  const [todos, setTodos] = useState([])

  const addTodo = async (text) => {
    // 1. 生成临时 ID
    const tempId = `temp-${Date.now()}`
    const tempTodo = { id: tempId, text, completed: false }

    // 2. 立即更新 UI（乐观）
    setTodos(prev => [...prev, tempTodo])

    try {
      // 3. 发送请求
      const newTodo = await createTodo(text)
      
      // 4. 用真实数据替换临时数据
      setTodos(prev => 
        prev.map(todo => todo.id === tempId ? newTodo : todo)
      )
    } catch (error) {
      // 5. 失败时移除临时数据（回滚）
      setTodos(prev => prev.filter(todo => todo.id !== tempId))
      
      // 6. 显示错误
      toast.error('添加失败')
    }
  }

  // 😵 复杂的状态更新逻辑
  // 😵 容易出错（忘记回滚、状态不同步等）
}
```

---

#### ✅ React Query 的乐观更新（内置支持）

```typescript
function TodoList() {
  const queryClient = useQueryClient()
  
  const { data: todos } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  })

  const addTodoMutation = useMutation({
    mutationFn: createTodo,
    
    // 乐观更新
    onMutate: async (newTodoText) => {
      // 1. 取消正在进行的查询
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      
      // 2. 保存之前的数据（用于回滚）
      const previousTodos = queryClient.getQueryData(['todos'])
      
      // 3. 乐观更新
      queryClient.setQueryData(['todos'], old => [
        ...old,
        { id: Date.now(), text: newTodoText, completed: false }
      ])
      
      // 4. 返回上下文（用于回滚）
      return { previousTodos }
    },
    
    // 失败时回滚
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['todos'], context.previousTodos)
      toast.error('添加失败')
    },
    
    // 成功后重新验证
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  return (
    <div>
      <button onClick={() => addTodoMutation.mutate('新任务')}>
        添加
      </button>
    </div>
  )
}
```

**优势：**
- ✅ 完整的乐观更新流程
- ✅ 自动回滚机制
- ✅ 类型安全
- ✅ 标准化的实现

---

### 问题 7: 轮询和实时更新 🔄

#### ❌ useEffect 手动轮询

```typescript
function RealtimeData() {
  const [data, setData] = useState(null)

  useEffect(() => {
    // 立即获取
    const fetchData = () => {
      fetch('/api/data').then(r => r.json()).then(setData)
    }

    fetchData()

    // 每 3 秒轮询
    const interval = setInterval(fetchData, 3000)

    // 清理
    return () => clearInterval(interval)
  }, [])

  return <div>{data}</div>
}
```

**问题：**
1. 标签页隐藏时仍在轮询（浪费资源）
2. 用户不在线时仍在轮询（浪费资源）
3. 错误处理复杂
4. 无法动态调整轮询间隔

---

#### ✅ React Query 的智能轮询

```typescript
function RealtimeData() {
  const { data } = useQuery({
    queryKey: ['realtimeData'],
    queryFn: fetchData,
    refetchInterval: 3000, // 每 3 秒刷新
    refetchIntervalInBackground: false, // ✅ 标签页隐藏时停止
    enabled: navigator.onLine, // ✅ 离线时停止
  })

  return <div>{data}</div>
}
```

**智能优化：**
- ✅ 标签页可见时才轮询
- ✅ 网络离线时自动停止
- ✅ 组件卸载时自动清理
- ✅ 可动态调整间隔

---

## React Query 如何解决这些问题

### 🎯 核心设计理念

React Query 专为**异步状态管理**设计，特别是**服务端状态**（Server State）。

**服务端状态的特点：**
1. 存储在远程服务器
2. 需要异步获取
3. 可能被其他人修改
4. 会过期（stale）
5. 需要缓存以提升性能

### 🛠️ 核心机制

#### 1. 基于 Key 的缓存系统

```typescript
// queryKey 决定数据的唯一性
useQuery({
  queryKey: ['user', userId], // 数组作为 key
  queryFn: () => fetchUser(userId),
})

// 不同的 userId 会有不同的缓存
// userId=1 → 缓存A
// userId=2 → 缓存B
```

#### 2. 自动取消过期请求

```typescript
// 当 queryKey 变化时，旧请求自动取消
// userId 从 1 → 2 → 3
// 请求1 和 请求2 自动取消
// 只有请求3 的结果会被使用
```

#### 3. 智能的缓存失效策略

```typescript
useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  staleTime: 5 * 60 * 1000, // 5分钟内数据视为新鲜
  cacheTime: 10 * 60 * 1000, // 缓存保留 10 分钟
})

// 数据新鲜时：直接使用缓存，不发请求
// 数据过期但有缓存：先显示缓存，后台刷新
// 没有缓存：显示加载状态，发送请求
```

#### 4. 自动的后台重新验证

```typescript
// 窗口聚焦时
refetchOnWindowFocus: true

// 网络重连时
refetchOnReconnect: true

// 组件重新挂载时
refetchOnMount: true
```

---

## 实际项目对比

### 场景：用户列表页面

#### ❌ 使用 useEffect (120 行代码)

```typescript
function UsersPage() {
  // 状态管理
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')

  // 获取数据
  useEffect(() => {
    let cancelled = false
    
    setLoading(true)
    setError(null)
    
    fetchUsers({ page, search })
      .then(response => {
        if (!cancelled) {
          setUsers(response.data)
          setTotal(response.total)
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [page, search]) // 依赖变化时重新请求

  // 搜索防抖
  const [debouncedSearch, setDebouncedSearch] = useState(search)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  // 删除用户
  const deleteUser = async (id) => {
    const originalUsers = [...users]
    
    // 乐观更新
    setUsers(users.filter(u => u.id !== id))
    
    try {
      await deleteUserApi(id)
    } catch (error) {
      // 回滚
      setUsers(originalUsers)
      setError('删除失败')
    }
  }

  // 刷新
  const refresh = () => {
    setLoading(true)
    fetchUsers({ page, search })
      .then(response => {
        setUsers(response.data)
        setTotal(response.total)
      })
      .finally(() => setLoading(false))
  }

  // 分页
  const handlePageChange = (newPage) => {
    setPage(newPage)
  }

  // 搜索
  const handleSearch = (value) => {
    setSearch(value)
    setPage(1) // 重置页码
  }

  if (loading && !users.length) return <Loading />
  if (error) return <Error message={error} />

  return (
    <div>
      <SearchBar value={search} onChange={handleSearch} />
      <UserTable 
        users={users} 
        onDelete={deleteUser} 
        loading={loading}
      />
      <Pagination 
        current={page}
        total={total}
        onChange={handlePageChange}
      />
      <button onClick={refresh}>刷新</button>
    </div>
  )
}
```

---

#### ✅ 使用 React Query (30 行代码)

```typescript
function UsersPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  // 获取用户列表
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users', page, search],
    queryFn: () => fetchUsers({ page, search }),
    keepPreviousData: true, // 切页时保留旧数据
  })

  // 删除用户
  const deleteMutation = useMutation({
    mutationFn: deleteUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  if (isLoading) return <Loading />
  if (error) return <Error message={error.message} />

  return (
    <div>
      <SearchBar 
        value={search} 
        onChange={(value) => {
          setSearch(value)
          setPage(1)
        }} 
      />
      <UserTable 
        users={data.data} 
        onDelete={(id) => deleteMutation.mutate(id)}
        loading={deleteMutation.isLoading}
      />
      <Pagination 
        current={page}
        total={data.total}
        onChange={setPage}
      />
      <button onClick={refetch}>刷新</button>
    </div>
  )
}
```

**对比：**
- 代码减少：75% (120行 → 30行)
- 自动防抖：通过 queryKey 变化
- 自动缓存：切页再回来无需重新请求
- 自动取消：搜索时旧请求自动取消
- 保留旧数据：切页时不闪屏

---

## 性能和体验提升

### 📊 性能对比

#### 场景 1: 用户快速切换标签

```
用户在列表页快速点击 10 个用户查看详情

useEffect 方式：
- 发送 10 次请求
- 可能显示错误用户（竞态条件）
- 每次都显示加载状态
- 返回列表时又重新请求

React Query 方式：
- 发送 10 次请求
- 自动取消过期请求，保证正确
- 缓存每个用户数据
- 返回列表时使用缓存，无需请求
```

**性能提升：50-70%** （减少请求次数）

---

#### 场景 2: 多组件共享数据

```
Dashboard 有 5 个组件都需要用户信息

useEffect 方式：
- 发送 5 次相同请求
- 或者需要手动实现 Context 共享

React Query 方式：
- 只发送 1 次请求
- 自动共享给所有组件
```

**请求减少：80%** （5个请求 → 1个请求）

---

#### 场景 3: 离线后重连

```
用户网络中断 1 分钟后恢复

useEffect 方式：
- 需要手动监听 online 事件
- 手动刷新数据
- 可能遗漏某些组件

React Query 方式：
- 自动检测网络恢复
- 自动刷新所有过期数据
- 零额外代码
```

---

### 💡 用户体验提升

| 场景 | useEffect | React Query |
|------|-----------|-------------|
| **首次加载** | 显示加载中 | 显示加载中 |
| **再次访问** | 重新加载，闪屏 ⚠️ | 立即显示缓存 ✅ |
| **切换页面后返回** | 重新加载，闪屏 ⚠️ | 立即显示缓存 ✅ |
| **窗口失焦后返回** | 数据可能过期 ⚠️ | 自动刷新 ✅ |
| **网络中断恢复** | 需手动刷新 ⚠️ | 自动刷新 ✅ |
| **重复请求** | 发送多次 ⚠️ | 自动去重 ✅ |
| **竞态条件** | 可能显示错误数据 ❌ | 自动处理 ✅ |

---

## 何时仍需要 useEffect

**重要：useEffect 并未被完全抛弃！**

### ✅ useEffect 的正确使用场景

#### 1. 非数据获取的副作用

```typescript
// ✅ 更新页面标题
useEffect(() => {
  document.title = `您有 ${count} 条新消息`
}, [count])

// ✅ 添加全局事件监听
useEffect(() => {
  const handleResize = () => {
    console.log('窗口大小改变')
  }
  
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])
```

#### 2. DOM 操作

```typescript
// ✅ 自动聚焦输入框
useEffect(() => {
  inputRef.current?.focus()
}, [])

// ✅ 滚动到顶部
useEffect(() => {
  window.scrollTo(0, 0)
}, [pathname])
```

#### 3. 订阅外部数据源

```typescript
// ✅ WebSocket 订阅
useEffect(() => {
  const ws = new WebSocket('ws://example.com')
  
  ws.onmessage = (event) => {
    console.log('收到消息:', event.data)
  }
  
  return () => ws.close()
}, [])
```

#### 4. 同步 React 状态到外部系统

```typescript
// ✅ 同步状态到 localStorage
useEffect(() => {
  localStorage.setItem('theme', theme)
}, [theme])
```

### ❌ 不要用 useEffect 做数据获取

```typescript
// ❌ 错误
useEffect(() => {
  fetchUsers().then(setUsers)
}, [])

// ✅ 正确
const { data: users } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
})
```

---

## 迁移指南

### 步骤 1: 安装 React Query

```bash
pnpm add @tanstack/react-query @tanstack/react-query-devtools
```

### 步骤 2: 设置 QueryClient

```typescript
// app/layout.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分钟
      cacheTime: 10 * 60 * 1000, // 10分钟
      retry: 1,
      refetchOnWindowFocus: false, // 可选：关闭窗口聚焦刷新
    },
  },
})

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  )
}
```

### 步骤 3: 迁移第一个组件

#### Before (useEffect)

```typescript
function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetchUsers()
      .then(setUsers)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />
  if (error) return <Error />
  return <UserList users={users} />
}
```

#### After (React Query)

```typescript
function Users() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })

  if (isLoading) return <Loading />
  if (error) return <Error />
  return <UserList users={users} />
}
```

### 步骤 4: 迁移带参数的请求

#### Before

```typescript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchUser(userId).then(data => {
      if (!cancelled) setUser(data)
    })
    return () => { cancelled = true }
  }, [userId])
}
```

#### After

```typescript
function UserProfile({ userId }) {
  const { data: user } = useQuery({
    queryKey: ['user', userId], // 包含参数
    queryFn: () => fetchUser(userId),
  })
}
```

### 步骤 5: 迁移 POST/PUT/DELETE 操作

#### Before

```typescript
const createUser = async (userData) => {
  setLoading(true)
  try {
    const newUser = await createUserApi(userData)
    setUsers([...users, newUser])
  } catch (error) {
    setError(error)
  } finally {
    setLoading(false)
  }
}
```

#### After

```typescript
const createUserMutation = useMutation({
  mutationFn: createUserApi,
  onSuccess: () => {
    // 刷新用户列表
    queryClient.invalidateQueries({ queryKey: ['users'] })
  },
})

// 使用
createUserMutation.mutate(userData)
```

---

## 常见问题解答

### Q1: React Query 会增加包体积吗？

**A:** 会增加约 13KB (gzip 后 ~4KB)，但考虑到：
- 减少 70-90% 的业务代码
- 避免自己实现缓存、取消等逻辑
- 性能提升带来的价值

**完全值得！**

---

### Q2: 学习 React Query 难吗？

**A:** 基础用法非常简单：

```typescript
// 99% 的场景只需要这个
const { data, isLoading, error } = useQuery({
  queryKey: ['key'],
  queryFn: fetchData,
})
```

进阶功能（乐观更新、无限滚动等）可以渐进式学习。

---

### Q3: 如何处理需要立即执行的请求？

**A:** useQuery 默认在组件挂载时就会执行。如果需要手动触发：

```typescript
const { data, refetch } = useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  enabled: false, // 不自动执行
})

// 手动触发
<button onClick={() => refetch()}>加载数据</button>
```

---

### Q4: 如何处理依赖其他数据的请求？

**A:** 使用 `enabled` 选项：

```typescript
// 先获取用户
const { data: user } = useQuery({
  queryKey: ['user'],
  queryFn: fetchUser,
})

// 只有当用户数据存在时才获取订单
const { data: orders } = useQuery({
  queryKey: ['orders', user?.id],
  queryFn: () => fetchOrders(user.id),
  enabled: !!user, // ✅ 条件启用
})
```

---

### Q5: useEffect 的依赖数组在 React Query 中如何体现？

**A:** 通过 `queryKey` 实现：

```typescript
// useEffect 方式
useEffect(() => {
  fetchData(userId, page)
}, [userId, page]) // 依赖数组

// React Query 方式
useQuery({
  queryKey: ['data', userId, page], // queryKey 包含所有依赖
  queryFn: () => fetchData(userId, page),
})
// queryKey 变化 = 重新请求
```

---

### Q6: 如何清空缓存？

```typescript
// 清空所有缓存
queryClient.clear()

// 清空特定缓存
queryClient.removeQueries({ queryKey: ['users'] })

// 使特定缓存失效（会触发刷新）
queryClient.invalidateQueries({ queryKey: ['users'] })
```

---

### Q7: React Query 与 Redux 有什么区别？

| 特性 | React Query | Redux |
|------|-------------|-------|
| **主要用途** | 服务端状态 | 客户端状态 |
| **数据来源** | API 请求 | 应用内状态 |
| **缓存** | 自动 | 手动 |
| **异步处理** | 内置 | 需要中间件 |
| **代码量** | 少 | 多 |

**可以同时使用！**
- Redux: 管理应用状态（主题、用户偏好等）
- React Query: 管理服务端数据（API 请求）

---

## 总结

### 🎯 核心要点

1. **useEffect 不是为数据获取设计的** - 它是为副作用设计的
2. **React Query 解决了所有痛点** - 竞态条件、缓存、加载状态等
3. **代码量减少 70-90%** - 更少的代码，更少的 bug
4. **性能和体验显著提升** - 智能缓存，自动优化
5. **useEffect 仍然有用** - 用于非数据获取的副作用

### 📈 迁移带来的价值

- **开发效率**: ⬆️ 3-5倍
- **代码质量**: ⬆️ 显著提升
- **Bug 数量**: ⬇️ 60-70%
- **用户体验**: ⬆️ 明显改善
- **可维护性**: ⬆️ 大幅提升

### 🚀 立即开始

```typescript
// 1. 安装
pnpm add @tanstack/react-query

// 2. 配置
<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>

// 3. 使用
const { data } = useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
})
```

### 📚 推荐资源

- [官方文档](https://tanstack.com/query/latest)
- [实战教程](https://tkdodo.eu/blog/practical-react-query)
- [视频教程](https://www.youtube.com/c/TanStack)

---

**最后的建议：**

如果你正在使用 useEffect 进行数据获取，强烈建议迁移到 React Query。这不仅是技术选型的问题，更是代码质量和用户体验的重大提升。

**数据获取用 React Query，其他副作用用 useEffect** - 这就是现代 React 应用的最佳实践。

---

**文档版本**: 1.0  
**最后更新**: 2025-11-05  
**维护者**: Development Team

