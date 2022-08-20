import { AppRegistry } from "react-native";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});

// alright. if the user isn't found in the database
// I can make it delete their auth self.
// That seems risky, though.

// There is a chance that their auth self will be deleted
// when really it was just a server error that couldn't
// find them.
// Their auth-self isn't a big deal, though.
// Their db self is where all the data is.

// I think I want to go with ultimatepropertyanalyzer.com

// For now, I can slap "Beta" on there and ask people
// to use it without charge, before the rest of the functionality is implemented.

// I would have to remove all the "pro" functionality, or
// add a config variable for switching from beta to paid.

// For it to truly be an ultimate property analyzer, I need 4 more things:
// 1. Bring back the custom variables/variable lists
// 2. Bring back custom outputs/output lists
//    - outputLists might be on the same page as custom variables
// 3. Bring back custom additive lists
//    - singleTimeList
//    - ongoingList
// 4. Bring back deal compare
//    - implement property compare, etc

// - Record new demo video in one go
// - Record demo audio in increments

// - get rid of login and register stuff

// 1. When a subscription is active (or inactive), getUserData and updateSubscription
//    should return the subscription header like they're supposed to
//    - This will require parsing the json
//    - You will want to borrow from the stripe webhook

// 2. Think about fixing the css register bug
// - I'd need to implement a way to delete a dev user.
// - I might add a route, "deleteUser", that only works in dev mode
//   It would send the logged-in user's email and totally delete them
// - Think about the race condition on the front-end for someone starting
//   a subscription. This might not even be a problem, though. Try it out.
//   - The FE waits one second
//   - The FE sends the request to update its subscription
//   - the subscription is not yet there—there is no subscription
//     that was made recently, or no subscription that has never been
//     obtained by the front end

// Launch the app on Sunday.
// - Post it, asking people for input
//   *Reddit
//    - r/realestateinvesting
//    - r/realestate
//    - r/landlords
//    - answer people's questions about how to size up properties
//    - Reddit ads
//   *Podcast ads
//    - Optimal finance daily
//   *Quora
//    - answer people's questions about how to size-up property
//   * Youtube ads
//   * Facebook ads
//    - banner
// - Post on the bigger pockets forum
// - Get an "influencer" to showcase it?

// Possible roadmap
// - Roadmap
// - Custom variables
// - Custom lists
// - Network effect
//   - Link with other accounts
//   - Share variables, lists, properties, etc
//   - Forum, or a reddit thread or discord
//     This would be too much I think

// It would be good to break up theme
// themeBtn.ts
// theme.btn.
// etc.

// You probably want example lists and variables.

reportWebVitals();
