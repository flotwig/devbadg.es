# Dockerfile extending the generic Node image with application files for a
# single application.
FROM gcr.io/google_appengine/nodejs
# Check to see if the the version included in the base runtime satisfies
# '~8.11.2', if not then do an npm install of the latest available
# version that satisfies it.
RUN /usr/local/bin/install_node '~8.11.2'
# You have to specify "--unsafe-perm" with npm install
# when running as root.  Failing to do this can cause
# install to appear to succeed even if a preinstall
# script fails, and may have other adverse consequences
# as well.
RUN npm install --unsafe-perm --global yarn
COPY . /app/

RUN yarn install --production || \
  ((if [ -f yarn-error.log ]; then \
      cat yarn-error.log; \
    fi) && false)

RUN yarn build
RUN cd server && yarn install --production
RUN cd -
CMD yarn start
