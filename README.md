##app

##gymPass 


##RFs (requisitos funcionias)

- [x] Its possible to create an account;
- [ ] its possible to authenticate;
- [x] Its possible get information about the authenticated user;
- [ ] Its possible to get number of check-in while user is logged in;
- [ ] Its possible to get users's check-in history;
- [ ] Its possible to find gyms near the users;
- [ ] Its possible to search gyms by name;
- [ ] Its possible for users to check-in into a gym;
- [ ] Its possible to validate a user's check-in;
- [ ] Its possivle to register a gym;

##RNs (regras de negócio)

- [x] Users cannot signin up with an duplicated email;
- [ ] Users cannot make more than one check-in on the same day;
- [ ] Users cannot check in unless they are within 100 meters of the gym;
- [ ] The check-in only can be validated within 20 minutes of being created;
- [ ] Check-in can be only validated by admins;
- [ ] Gym can only be registered by admins;


##RNFs (requisitos não funcionais)

- [x] Password must be securely encrypted;
- [x] The user's data must be persisted in a postgreSQL database;
- [ ] All elements of a list must be displayed 20 per page;
- [ ] Users must be identified by a JWT (json Webtoken);

