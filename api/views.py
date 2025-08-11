from django.shortcuts import render


def Home(request):
    """
    Render the home page.
    """
    return render(request, 'Home.html')