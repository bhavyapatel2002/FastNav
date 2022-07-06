# FastNav

#### Access this application at: https://fastnav.pythonanywhere.com

## Background

This web application was developed to address the issue of finding gas stations along a particular route. For example, if you are driving to a certain destination and want to fill your gas, you may want to find a gas station that lies perfectly along your route - this web app helps address that scenario. The user can enter an origin and a destination, and then the user is presented with a map that outlines the route as well as any gas stations that lie within 0.2 miles of the route. This web app was built as a Flask application. The frontend was built by leveraging Bootstrap CSS. This project also leverages the Google Maps JavaScript API, as well as the RouteBoxer JavaScript API.

## Features

- Home page with dynamically sized components to ensure proper formatting is maintained even when browser is resized by user
- Search page with dynamically sized map component
- Google Maps Place Autocomplete API integration to assist users in typing the origin and destination
- Google Maps API integration to display map, overlay route on map, display markers for all gas stations along route
- Utilization of RouteBoxer JavaScript API to create grid overlay on route such that any given point along the edge of the boxes is approximately 0.2 miles from the route (this overlay grid system is what is used to find gas stations within the specified 0.2 distance from the route)
- Pop-ups for each gas station found along route that show the station's address and phone number (if found) as well as a link to that location on Google Maps
- Ability to enter parameters for origin and destination through URL (this allows for sharing specific routes with friends through the use of a single URL)
- Project deployed to PythonAnywhere server so that it can be accessed at any time from any location

## To-Do

- The web app currently has a limit on maximum route length to limit the number of API calls, this could be removed if this project had funding
- Add ability for users to search for other types of establishments (parks, ice cream shops, etc.)
- Add ability for users to modify distance from route that they are willing to drive
- Text under modal in Search tab shows origin and destination in all lowercase letters, figure out why this happens
