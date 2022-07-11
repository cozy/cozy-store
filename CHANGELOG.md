# 1.9.13

# 1.9.12

## ✨ Features

* Add coachco2 settings locales
* Add cc.cozycloud.errors permission
* Add locales and icon for new DACC remote-doctype 

## 🐛 Bug Fixes

* Handle Amirale App UI update


## 🔧 Tech

* Upgrade cozy-client to get ability to force HTTPs fetches when `window.cozy.isSecureProtocol` is `true`
* Update cozy-intent 
* Fix Proptype issue
* Fix warnings issues


# 1.9.11

## ✨ Features

* Loading App's icons: Should be faster. We now rely on img src=http directly if we are not in OAuth. Otherwise we do a fetch.

## 🔧 Tech

* Upgrading Cozy Client, Cozy UI, Material UI to benefit of new features from our libraries

# 1.9.10

## ✨ Features

* Reword `My application` to `Installed` ([PR #743](https://github.com/cozy/cozy-store/pull/743))
* Reword permissions modal ([PR #744](https://github.com/cozy/cozy-store/pull/744))
* Add new doctypes ([PR #745](https://github.com/cozy/cozy-store/pull/745) and [PR #752](https://github.com/cozy/cozy-store/pull/752))
* Remove `open` button's icon ([PR #748](https://github.com/cozy/cozy-store/pull/748))
* Improve permissions modal to correctly display remote doctypes ([PR #750](https://github.com/cozy/cozy-store/pull/750))
* Improve UI of App tiles to ease visualisation of installed apps, updatable apps and support multiline title ([PR #763](https://github.com/cozy/cozy-store/pull/763))

## 🐛 Bug Fixes

* Fix scrollbar positionning when main content is not large enough ([PR #747](https://github.com/cozy/cozy-store/pull/747))

## 🔧 Tech
