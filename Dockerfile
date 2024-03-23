FROM mcr.microsoft.com/playwright:v1.40.0-jammy
WORKDIR /home/app/
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
RUN chown -R pwuser:pwuser /home/app
USER pwuser
ENTRYPOINT ["npm","run","test"]