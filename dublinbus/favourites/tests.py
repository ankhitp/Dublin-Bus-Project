from django.test import TestCase


# Create your tests here.
class getfavTest(TestCase):
    def test_favourite_page(self):
        print('******************test_favourite_page()**********************')
        # send GET request.
        response = self.client.get('/favourites/')
        print('Response status code : ' + str(response.status_code))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'favourites.html')

class postfavTest(TestCase):
    def test_favourite_page(self):
        print('******************test_favourite_page()**********************')
        # send GET request.
        response = self.client.post('/favourites/')
        print('Response status code : ' + str(response.status_code))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'favourites.html')