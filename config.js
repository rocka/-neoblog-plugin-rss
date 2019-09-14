const PluginRSS = require('.');

module.exports = {
    title: 'PluginRSS',
    articleDir: 'node_modules/@neoblog/neoblog/example/article',
    plugins: [
        new PluginRSS({
            limit: 10,
            route: '/rss',
            feedOptions: {
                site_url: 'http://localhost:2233',
                description: `NeoBlog 's RSS Plugin`,
                generator: 'node-rss',
                language: 'en'
            },
            itemOptions: {
                author: 'rocka'
            }
        })
    ],
    // arguments passed to template. can be anything but null.
    templateArgs: {
        indexHeading: `NeoBlog's RSS Plugin`,
        side: {
            title: 'PluginRSS',
            items: [
                [
                    { name: 'Index', link: '/' },
                    { name: 'RSS', link: '/rss' }
                ],
                [
                    { text: `OS: ${process.platform} ${process.arch}` },
                    { text: `Node: ${process.version}` }
                ]
            ]
        }
    }
};
