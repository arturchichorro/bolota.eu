import { build } from 'velite'

/** @type {import('next').NextConfig} */
export default {
    
    webpack: config => {
        config.plugins.push(new VeliteWebpackPlugin())
        return config
    }
}

class VeliteWebpackPlugin {
    static buildPromise

    apply(/** @type {import('webpack').Compiler} */ compiler) {
        // executed three times in nextjs
        // twice for the server (nodejs / edge runtime) and once for the client
        compiler.hooks.beforeCompile.tapPromise('VeliteWebpackPlugin', async () => {
            if (!VeliteWebpackPlugin.buildPromise) {
                const dev = compiler.options.mode === 'development'
                VeliteWebpackPlugin.buildPromise = build({ watch: dev, clean: !dev })
            }

            await VeliteWebpackPlugin.buildPromise
        })
    }
}
