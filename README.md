# FlyGit

This is the source code behind <https://flygit.fly.io/>.

FlyGit a port of [RawGit](https://rawgit.com/) that runs on [Fly Edge Apps](fly.io/mix/edge-applications/). All original code was writen by [Ryan Grove](https://github.com/rgrove) and [contributors](https://github.com/rgrove/rawgit/graphs/contributors).

## Installing

1. Install Node.js

2. Clone this git repo.
```
git clone https://github.com/superfly/flygit.git
```

3. Install dependencies
```
cd flygit && npm install
```

4. Start the local server
```
npm start
```

5. Browse to http://localhost:3000/ and you should see FlyGit in action.

## Running Tests

```
npm test
```

## Developing

`fly server` observes any changes made to the files and will automatically recompile
the code (as specified in `webpack.config.js`).

Checkout [Fly Edge Apps](https://fly.io/docs/apps/) for basic concepts, examples and
 [API Reference](https://fly.io/docs/apps/api/).


## Contributing

Want to fix a bug? If it's something small, just send us a pull request. If you
want to add a new feature or make significant changes, please get in touch and
ask (opening an issue is :+1:) before doing the work.

## Deploying

The best part is, there's nothing special about this app. You can grab it and
run it as your own on Fly's global edge infrastructure in a few simple steps:

1. Sign up for [Fly Edge Beta](https://fly.io/mix/edge-applications/) and create your account.

2. (Assuming you already installed FlyGit locally) Create your own App on Fly:

```
# provide your login credentials
fly login

# create your app on Fly
# get your org name from `fly orgs`
fly apps create my-org/my-flygit-app
```

3. Create `.fly.yml` file:

```
# .fly.yml

app_id: my-org/my-flygit-app
```

4. Add your hostname to your Fly App:

```
fly hostnames add my-fly-git-app.hostname.com
```

5. Go to your DNS provider and add a CNAME for _my-fly-git-app.hostname.com_ to
point to **beta.edge.fly.io**
