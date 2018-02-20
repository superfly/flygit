# FlyGit Frequently Asked Questions

_This FAQ is based on [RawGit's FAQ](https://github.com/rgrove/rawgit/blob/master/FAQ.md), a great project by [Ryan Grove](http://wonko.com/), with certain areas modified as appropriate for FlyGit._

## Who runs FlyGit?

Hi, we're [Fly.io](http://twitter.com/flydotio) and we put it up FlyGit on our global edge infrastructure as a [Fly Edge App](fly.io/docs/apps/).

## Why is this necessary? Can't I just load files from GitHub directly?

When you request certain types of files (like JavaScript, CSS, or HTML) from `raw.githubusercontent.com` or `gist.githubusercontent.com`, GitHub serves them with a `Content-Type` header set to `text/plain`. As a result, most modern browsers won't actually interpret these files as JavaScript, CSS, or HTML and will instead just display them as text.

GitHub does this because serving raw files from a git repo is inefficient and they want to discourage people from using their GitHub repos for static file hosting.

FlyGit acts as a caching proxy. It forwards requests to GitHub, caches the responses, and relays them to your browser with an appropriate `Content-Type` header based on the extension of the file that was requested. The caching layer ensures that minimal load is placed on GitHub, and you get quick and easy static file hosting right from a GitHub repo. Everyone's happy!

## Is FlyGit associated with GitHub?

No, FlyGit is not associated with GitHub in any way. Please don't contact GitHub asking for help with FlyGit.

## What's the difference between development and CDN URLs?

When you make a request to a `dev.flygit.fly.io` URL (a development URL), the FlyGit app (thru Fly's global delivery network) loads the requested file from GitHub, serves it to your browser and doesn't cache it. If you push new changes to GitHub, you can reload and see them within a few minutes (GitHub caches `raw.githubusercontent.com` content, so there might be a delay before you see your changes).

Requests to `flygit.fly.io` (a production URL) are routed through Fly just like the development URL with the only difference that files are cached on Fly edge servers. This results in the best performance, but it means that reloading won't fetch new changes from GitHub.

During development, when traffic is low and freshness is more important than performance, use a development URL. For anything you share with the public or push to production, use a production URL.

## Can I use a development URL on a production website or in public example code?

Sure, but you might get throttled eventually.

## What will happen if a development URL gets large amounts of traffic?

You might see poor performance, and potentially service interruption.

## What will happen if a production URL gets large amounts of traffic?

Usually this is fine, however it is a free a service. If you have a high volume of traffic, consider running your own version of [RawGit](https://github.com/rgrove/rawgit/) or launch a clone of FlyGit on Fly.io.

## How long does Fly cache files? How can I make it refresh my file?

TODO: provide info on caching

## I need guaranteed 100% uptime. Should I use flygit.fly.io?

No. FlyGit is a free, best-effort service and doesn't provide any uptime or support guarantees.

While we do our best to keep things running, things sometimes go wrong. Sometimes there are network or provider issues outside my control. Sometimes abusive traffic temporarily affects response times. Sometimes things break while we're asleep and we don't know there are problems until we wake up. And sometimes we break things by doing something dumb (although we try really hard not to).

If you need to serve files that are crucial to your business, you should pay for a host with well-funded infrastructure and uptime guarantees and run [RawGit](https://github.com/rgrove/rawgit/) copy yourself or launch a copy of FlyGit as a paid [Fly Edge App](fly.io/docs/apps/).

## Why do anonymous gist URLs return 403 errors?

FlyGit doesn't serve anonymous gists at this time.

## I moved a file in my repo and now old FlyGit URLs are broken. Is there any way to redirect to the new file?

Not at this point. It would be very easy to implement in your own copy of FlyGit, though :)

## Does FlyGit work for private repositories?

Not at this point.

## I have feedback or want to report a problem! Who can I contact?

-   To report a critical issue like FlyGit being broken or to share general feedback, email us at <support@fly.io> or send a tweet to [@flydotio](https://twitter.com/flydotio).

-   To report a non-critical issue, please [file an issue](https://github.com/superfly/flygit/issues) on FlyGit's GitHub project.

-   To report a security concern, please email `security@fly.io` privately.
