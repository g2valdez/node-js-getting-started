steps to use:

open git bash and do the following:

change into the directory you want your files to be in. (using cd command)


paste the following:
git clone https://github.com/g2valdez/spy-guys.git
cd spy-guys
heroku git remote -a spy-guys


after making changes, check the status of git, make a local commit, and push to the github repo using the following 3 lines:
git status
git add --all
git commit -m "enter message about changes within these quotes"
git push


let us all know when you've made a commit, so that we can pull new changes to our repo. When another user has pushed, we need to update our code using the following commands:


(if you have unstaged changes): 
git add --all
git commit -m "message about your recent changes"


(whether or not you have unstaged changes, you must run this):
git fetch --all
git pull


if you want to see the changes you've made, run the following command:
heroku local
and navigate to localhost:5000 in a web browser of your choice


if you want to push changes you've made to the heroku page (the page you get when you go to spy-guys.herokuapp.com),
 after pushing to the github repo, run the following command:
 git push heroku master






