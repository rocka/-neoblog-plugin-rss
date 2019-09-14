# neoblog-plugin-rss

Add RSS feed support, powered by [`node-rss`](https://github.com/dylang/node-rss).

## Usage

see [config.js](./config.js).

## Plugin options

```ts
new PluginRSS(options: IPluginOptions);

interface IPluginOptions {
    limit: number
    route: string
    feedOptions?: NodeRSS.FeedOptions
    itemOptions?: NodeRSS.ItemOptions
}
```

### limit

Max articles in RSS feed, default to 10.

### route

Route to RSS feed, default to `'/rss'`.

### feedOptions

See [NodeRSS.FeedOptions](https://github.com/dylang/node-rss#feedoptions) for details.

But some fields are required:

#### site_url

URL to the site that the feed is for.

#### description

Though not required, but it's recommended to have a description.

### itemOptions

See [NodeRSS.ItemOptions](https://github.com/dylang/node-rss#itemoptions) for details.

Useful fields:

#### author

Name of the item's creator.
