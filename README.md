# steemit-strava

## Goals

This is intended to add strava integration into steemit. What does that mean?
1. Objects native to strava can be represented on the steemit platform. Among these are 
    * Routes
    * Activities
    * Performance Statistics Reports
1. Preferences can be persisted
1. Ratings/comments on strava can be shared to steemit in some way. For example, when someone leaves a comment on an activity, that can be represented in steemit.

### Example workflows

#### Routes

When a user creates a route, a post is created in steemit about that route. Users can vote on it.

#### Activities

When a user creates an activity, a post is created in steemit about that activity. Users can vote and leave comments. This can be done before the activity is even finished.


Preferences are namespace scoped. 

```
GET /<namespace>/preferences
```

```
POST /<namespace>/preferences
```

```
PUT /<namespace>/preferences
```

## Usage

### Store Preferences

#### Give Access to an App

> In this case, give access to the Strava APP

#### 

### Fetch Preferences

```
GET /
```