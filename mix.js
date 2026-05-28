const mix = require('laravel-mix')
const webpack = require('webpack')
const path = require('path')

class NovaExtension {
    name() {
        return 'nova-extension'
    }

    register(name) {
        this.name = name
    }

    webpackConfig(webpackConfig) {
        // Externalize the libraries Nova already exposes as runtime globals so
        // the tool uses Nova's shared copies instead of re-bundling them.
        // Nova's app.js maps laravel-nova-ui -> global LaravelNovaUi.
        webpackConfig.externals = {
            vue: 'Vue',
            'laravel-nova-ui': 'LaravelNovaUi',
        }

        webpackConfig.resolve.alias = {
            ...(webpackConfig.resolve.alias || {}),
            'laravel-nova': path.join(
                __dirname,
                '../../vendor/laravel/nova/resources/js/mixins/packages.js'
            ),
        }

        webpackConfig.output = {
            uniqueName: this.name,
        }
    }
}

mix.extend('nova', new NovaExtension())