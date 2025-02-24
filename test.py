import math

# 定义总数和选择数
n = 2048
k = 12

# 计算排列数
permutations = math.factorial(n) // math.factorial(n - k)

# permutations = 2**256

# 以科学计数法输出结果
print(f"{permutations:.3e}")

# 假设的哈希率（每秒尝试次数）
hash_rate = 1e9  # 10亿次尝试/秒

# 计算碰撞时间（秒）
collision_time_seconds = permutations / hash_rate

# 以科学计数法输出结果
print(f"碰撞时间: {collision_time_seconds:.3e} 秒")

# 转换为年、天、小时
collision_time_years = collision_time_seconds / (60 * 60 * 24 * 365.25)
collision_time_days = collision_time_seconds / (60 * 60 * 24)
collision_time_hours = collision_time_seconds / (60 * 60)

print(f"碰撞时间: {collision_time_years:.3e} 年")
print(f"碰撞时间: {collision_time_days:.3e} 天")
print(f"碰撞时间: {collision_time_hours:.3e} 小时")