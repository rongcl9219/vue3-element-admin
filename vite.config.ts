import { defineConfig, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import viteCompression from 'vite-plugin-compression'
import { createHtmlPlugin } from 'vite-plugin-html'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

const pathResolve = (pathStr: string): string => {
    return resolve(__dirname, '.', pathStr)
}

/**
 * gzip 压缩
 */
const viteCompressionOptions = {
    filter: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i, // 需要压缩的文件
    threshold: 1024, // 文件容量大于这个值进行压缩
    //algorithm: 'gzip', // 压缩方式
    ext: 'gz', // 后缀名
    deleteOriginFile: false // 压缩后是否删除压缩源文件
}

const pageName = 'vue Element Admin'

export default defineConfig(({ command }): UserConfig => {
    const buildPlugins = []
    if (command === 'build') {
        buildPlugins.push(viteCompression(viteCompressionOptions))
    }

    return {
        plugins: [vue(),
            createHtmlPlugin({
                inject: {
                    data: {
                        title: pageName
                    }
                }
            }),
            createSvgIconsPlugin({
                iconDirs: [pathResolve('src/icons/svg')],
                symbolId: 'icon-[dir]-[name]'
            }),
            ...buildPlugins],
        resolve: {
            alias: {
                '@': pathResolve('src')
            }
        },
        css: {
            preprocessorOptions: {
                scss: {
                    charset: false
                }
            }
        },
        server: {
            open: false,
            host: '0.0.0.0',
            port: 5173, // 端口
            // proxy: {
            //     '/api': {
            //         target: 'http://test.rongcl.cn/',
            //         changeOrigin: true,
            //         ws: false,
            //         rewrite: (path) => path.replace(/^\/api/, '/api')
            //     }
            // },
            hmr: {
                overlay: true
            }
        },
        build: {
            outDir: 'dist',
            assetsDir: './static', //静态资源文件夹，和outDir同级
            assetsInlineLimit: 4096, // kb, 小于此值将内联base64格式
            cssCodeSplit: true,
            sourcemap: false,
            chunkSizeWarningLimit: 500,
            minify: 'terser',
            terserOptions: {
                compress: {
                    // eslint-disable-next-line camelcase
                    drop_console: true,
                    // eslint-disable-next-line camelcase
                    drop_debugger: true
                }
            },
            rollupOptions: {
                output: {
                    chunkFileNames: 'static/js/[name]-[hash].js',
                    entryFileNames: 'static/js/[name]-[hash].js',
                    assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
                    manualChunks: {
                        // 分包配置，配置完成自动按需加载
                        vue: ['vue', 'vue-router', 'pinia', 'element-plus']
                    }
                }
            }
        }
    }
})
