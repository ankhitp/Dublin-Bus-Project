from django.test import TestCase, Client
client=Client()

# class YourTestClass(TestCase):
#     @classmethod
#     def test_favourites(self):
#         print("----Testing favourites views.py----")
#         response = self.client.get('favourites.html')
#         print("Status code: " + str(response.status_code))
#         self.assertEqual(response.status_code, 200)

#     def test_favourites_mobile(self):
#         print("---- Testing mobile favourite views.py ----")
#         response = self.client.get('mobile/m_favourites.html')
#         print("Status code: " + str(response.status_code))
#         self.assertEqual(response.status_code, 200)


# Create your tests here.
<<<<<<< HEAD


from django.test import TestCase
class ViewTest(TestCase):
    def test_home_page(self):
        print('******************test_home_page()**********************')
=======
class getfavTest(TestCase):
    def test_favourite_page(self):
        print('******************test_favourite_page()**********************')
>>>>>>> 220f1cd12cf57041cd102e9e2d21a74c324b92e6
        # send GET request.
        response = self.client.get('/favourites/')
        print('Response status code : ' + str(response.status_code))
        self.assertEqual(response.status_code, 200)
<<<<<<< HEAD
=======
        self.assertTemplateUsed(response, 'favourites.html')

class postfavTest(TestCase):
    def test_favourite_page(self):
        print('******************test_favourite_page()**********************')
        # send GET request.
        response = self.client.post('/favourites/')
        print('Response status code : ' + str(response.status_code))
        self.assertEqual(response.status_code, 200)
>>>>>>> 220f1cd12cf57041cd102e9e2d21a74c324b92e6
        self.assertTemplateUsed(response, 'favourites.html')