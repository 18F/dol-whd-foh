from locust import HttpLocust, TaskSet

def index(l):
    l.client.get("/")

def get_page(l):
    l.client.get("/chapters/20.html")

def search(l):
    l.client.get("/search.html?q=agricultural")

class UserBehavior(TaskSet):
    tasks = {index:1, get_page: 1, search: 1}

class WebsiteUser(HttpLocust):
    task_set = UserBehavior
    min_wait=5000
    max_wait=9000