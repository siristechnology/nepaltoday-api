from locust import HttpUser, task, between
from datetime import datetime


class QuickstartUser(HttpUser):
    wait_time = between(1, 2.5)

    @task
    def hello_world(self):
        # self.client.post("/login", json={"username": "foo", "password": "bar"})
        current_time = datetime.now().isoformat()

        self.client.post("/graphql", json={
            "operationName": "homeScreenQuery",
            "variables": {},
            "query": "query homeScreenQuery {  getArticles(criteria: {lastQueryDate: \"" + current_time + "\"}) {    _id    title    shortDescription    content    link    imageLink    createdDate    modifiedDate    category    source {      _id      name      logoLink    }  }}query getNepaliEvent {  getNepaliEvent(date: \"2078-02-09\") {    isHoliday    tithi    event  }}"})

    # @task(3)
    # def view_items(self):
    #     for item_id in range(10):
    #         self.client.get(f"/item?id={item_id}", name="/item")
    #         time.sleep(1)

    # def on_start(self):
