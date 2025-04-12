pm2 delete scoutjar-recruiter
cd ~/projects/scoutjar/scoutjar-recruiter
npm install
pm2 start npm --name scoutjar-recruiter -- run dev
pm2 save
