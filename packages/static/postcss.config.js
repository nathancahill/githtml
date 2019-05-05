const PROD = process.env.NODE_ENV === 'production'

module.exports = {
    plugins: [
        require('tailwindcss')('./tailwind.config.js'),
        require('autoprefixer'),
        PROD &&
            require('postcss-purgecss')({
                content: ['../frontend/**/*.js'],
                defaultExtractor: content =>
                    content.match(/[A-Za-z0-9-_:/]+/g) || [],
            }),
    ],
}
