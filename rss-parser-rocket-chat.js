const Parser = require('rss-parser');
const request = require("request");
const rssFeeds = require('./rss-feeders.json');
const maxNumberOfPostsPerRssFeed = 10;

const postToRocketChat = async(rocketChatPosts, webhookUrl) => {
    const options = {
        method: 'POST',
        url: webhookUrl
    };

    rocketChatPosts.forEach(body => {
        options.body = JSON.stringify(body);
        request(options, function (error, response, body) {
            if (error) {
                console.log('ERROR', error);
                throw new Error(error);
            } else {
                if (response.statusCode !== 200) {
                    console.log('ERROR', response.statusCode, response.statusMessage);
                    throw new Error(response.statusMessage);
                }
            }
        });
    });
}

const getRssFeeds = async() => {
    const parser = new Parser();

    try {
        await rssFeeds
            .feeds
            .forEach(async(feed) => {

                await feed
                    .urlFeeds
                    .forEach(async(url) => {
                        const rocketChatPosts = [];
                        const rssData = await parser.parseURL(url);

                        rssData
                            .items
                            .slice(0, maxNumberOfPostsPerRssFeed)
                            .forEach(item => {
                                const rssObj = {
                                    color: "#764FA5",
                                    icon_emoji: ":your_icon_here:",
                                    text: item.link
                                };

                                rocketChatPosts.push(rssObj);
                            });

                        postToRocketChat(rocketChatPosts, feed.webhookUrl);
                    });
            });

    } catch (error) {
        console.log('Error occurred', error);
    }
}

getRssFeeds();
