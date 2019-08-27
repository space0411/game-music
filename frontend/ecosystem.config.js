module.exports = {
    apps: [
        {
            name: 'vgm-web',
            script: 'npx',
            interpreter: 'none',
            args: 'serve -s build',
        }
    ]
}
