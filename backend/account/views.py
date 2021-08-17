from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.contrib.auth.models import User
from .serializer import UserSerializer

class RegisterView(APIView):
    permission_classes = (permissions.AllowAny, )


    def post(self, request, format=None):
        try:
            data = self.request.data
            first_name = data['first_name']
            last_name = data['last_name']
            username = data['username']
            password = data['password']
            re_password = data['re_password']

            if password == re_password:
                if len(password) >= 8:
                    if not User.objects.filter(username=username).exists():
                        user = User.objects.create_user(
                            first_name = first_name,
                            last_name = last_name,
                            username = username,
                            password = password,
                        )

                        user.save()

                        if User.objects.filter(username=username).exists():
                            return Response(
                                {'success': 'Account created successfully.'},
                                status=status.HTTP_201_CREATED
                            )

                        else:
                            return Response(
                                {'error': 'Internal Server error.'},
                                 status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                        return Response(
                            {'error': 'No user in this database'},
                            status=status.HTTP_400_BAD_REQUEST)

                    else:
                        return Response(
                            {'error': 'This user already existed '},
                            status=status.HTTP_400_BAD_REQUEST)

                else:
                    return Response(
                        {'error': 'Password must be at least 8 characters.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            else:
                return Response(
                    {'error': 'Password does not match'},
                    status=status.HTTP_400_BAD_REQUEST
                )


        except:
            return Response(
                {'error': 'Error at Register View'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class LoadUserView(APIView):
    def get(self, request, format=None):

        try:
            user = self.request.user
            user = UserSerializer(user)
            return Response(
                {'user': user.data},
                status=status.HTTP_200_OK
            )

        except:
            return Response(
                {'error': 'Error at LoadUserView'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
