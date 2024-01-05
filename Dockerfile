FROM mcr.microsoft.com/playwright:v1.32.3-focal
WORKDIR /home/app/
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
ENTRYPOINT ["npm","run","test"]
