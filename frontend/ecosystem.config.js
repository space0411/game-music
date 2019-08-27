module.exports = {
    apps: [
        {
            name: 'vgm-web',
            script: 'npx',
            interpreter: 'none',
            args: 'serve -s /home/video-game-music-project/game-music/frontend/build',
        }
    ]
}
