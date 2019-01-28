This project simply take a collection of rss feeds, parses the top 10 (via rss-parser) then issues post requests to an incoming webhook that you have setup in RocketChat.

// export NODE_TLS_REJECT_UNAUTHORIZED="0" && node rss-parser-rocket-chat.js
