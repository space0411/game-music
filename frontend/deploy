ssh root@duynhat <<EOF
 cd /home/video-game-music-project/game-music
 git pull
 cd frontend
 npm install
 npm run build
 pm2 restart vgm-web
 exit
EOF