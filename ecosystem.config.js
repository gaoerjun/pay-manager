module.exports = {
  apps: [{
    name: "your-app-name",
    script: "npm",  // 你的入口文件
    instances: 1,
    args: "start",// 实例数量
    exec_mode: "cluster",  // 执行模式
    watch: true,         // 是否监听文件变化
    max_memory_restart: "1G", // 内存超过多少时自动重启
    env: {
      NODE_ENV: "development"
    },
    env_production: {
      NODE_ENV: "production"
    }
  }]
} 