# Craftsvilla Angular Checkout

Hey there geek ! This project handles the checkout flow for Craftsvilla. It has been written in Angular.
[Link]

### Tech

The project uses a number of open source projects to work properly:

* [AngularJS]
* [RequireJS]
* [Bootstrap]

### Setup (CentOS)

Step 1 : Install Ruby and Gem

```sh
$ yum intall ruby-devel
$ yum install rubygems
```
Step 2 : Install Compass

```sh
$ gem install compass
```

Step 3 : Install Grunt and Bower as Root (Install Node first if not there)

```sh
$ npm install -g grunt-cli
$ npm install -g bower
```

Step 4 : Clone repository

```sh
$ git clone https://github.com/craftsvilla/cv_angular_frontend.git cv_angular_frontend
$ cd cv_angular_frontend
$ npm install && bower install
$ grunt
$ npm start
```

Step 5 : Open http://localhost:8000 anf walla !


### Setup (MacOSX)

Step 1 : Install Ruby and Gem (Install if not there)

Step 2 : Install Compass

```sh
$ gem install compass
```

Step 3 : Install Grunt and Bower as Root (Install Node first if not there)

```sh
$ npm install -g grunt-cli
$ npm install -g bower
```

Step 4 : Clone repository

```sh
$ git clone https://github.com/craftsvilla/cv_angular_frontend.git cv_angular_frontend
$ cd cv_angular_frontend
$ npm install && bower install
$ grunt
$ npm start
```

Step 5 : Open http://localhost:8000 anf walla !


### PR Procedure

Remember to rebase with upstream staging everyday

1. Fork the repository.
2. Checkout local staging branch.
3. Branch out from there (feature_bla_bla)
4. Write sweet code !
5. Rebase with upstream staging
6. Resolve Conflicts (If Any) with conscent of merger
7. Raise PR across fork (to staging)

### QA Procedure

1. Raise PR to demo branch across fork (which should be just a copy of staging)
2. Sit with Merger and ask him to deploy demo branch to securestaging
3. Have the QA round.
4. Raise PR to staging (Upstream, across fork)

### Release procedure

1. Make sure that branch is Tested.
2. Merge the branch with staging (Approve PR)
3. git checkout staging
4. git pull --rebase origin staging
5. git checkout prod-release
6. git pull origin staging
7. git push origin prod-release
8. Draft a new release (v1.x.x) from prod-release branch [New Release]
9. Get branch prod-release deployed to secure.craftsvilla.com
10. Initiate Cache Flush for files : /index.html and /requirements.html

You now have power. Remember, with great power, comes great responsibility. You're not Spiderman by the way !

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [New Release]: https://github.com/craftsvilla/cv_angular_frontend/releases/new
   [Link]: https://secure.craftsvilla.com/
   [AngularJS]: https://angularjs.org/
   [RequireJS]: http://requirejs.org/
   [Bootstrap]: http://getbootstrap.com/
