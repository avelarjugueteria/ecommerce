
@echo off
echo ==============================================
echo      AVELAR JUGUETERIAS - INVENTORY SYNC
echo ==============================================
echo.
echo Scanning C:\Users\rriav\iCloudPhotos\Photos...
echo matching SKUs and uploading to Supabase...
echo.
node sync_images.js
echo.
echo ==============================================
echo                DONE
echo ==============================================
pause
