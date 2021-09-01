# NiliFlix
Movie API App
## Description 
Niliflix is a web application which will provide users with access to information about different
movies, directors, and genres.An API was built in such way that users will be able to sign up, update their
personal information, and create a list of their favorite movies.

#### User Stories:
1) As a user, I want to be able to receive information on movies, directors, and genres so that I
can learn more about movies I’ve watched or am interested in.

2) As a user, I want to be able to create a profile so I can save data about my favorite movies.

### Essential Features

- Return a list of ALL movies to the user
- Return data (description, genre, director, image URL, whether it’s featured or not) about a
single movie by title to the user
- Return data about a genre (description) by name/title (e.g., “Thriller”)
- Return data about a director (bio, birth year, death year) by name
- Allow new users to register
- Allow users to update their user info (username, password, email, date of birth)
- Allow users to add a movie to their list of favorites
- Allow users to remove a movie from their list of favorites
- Allow existing users to deregister

### Technical Requirements

- The API must be a Node.js and Express application.
- The API must use REST architecture, with URL endpoints corresponding to the data
operations listed above
- The API must use at least three middleware modules, such as the body-parser package for
reading data from requests and morgan for logging.
- The API must use a “package.json” file.
- The database must be built using MongoDB.
-The business logic must be modeled with Mongoose.
- The API must provide movie information in JSON format.
- The JavaScript code must be error-free.
- The API must be tested in Postman.
- The API must include user authentication and authorization code.
- The API must include data validation logic.
- The API must meet data security regulations.
- The API source code must be deployed to a publicly accessible platform like GitHub.
- The API must be deployed to Heroku.

<h4>Endpoints for REST API</h4>
					<table>
						<thead>
							<tr>
								<th>Business Logic</th>
								<th>URL</th>
								<th>HTTP Method</th>
								<th>Request format</th>
								<th>Response format</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Return a list of ALL movies to the user</td>
								<td>/movies</td>
								<td>GET</td>
								<td>None</td>
								<td>A JSON object holding Data about all the movies</td>
							</tr>
							<tr>
								<td>Return data about a single movie by title to the user</td>
								<td>/movies/[title]</td>
								<td>GET</td>
								<td>None</td>
								<td> A JSON object holding data about a single movie, containing description, genre, director and
									image URL. Example: <br>
									{<br>
									name: "movieName",<br>
									descripction: "This is the most funniest movie you'll ever get to see.",<br>
									genre: "genre",<br>
									director: "director name",<br>
									actors: "actors name",<br>
									release: "year",<br>
									rating: "number",<br>
									imageUrl: "www.link.to/movie/pic"<br>
									}
								</td>
							</tr>
							<tr>
								<td>Return data about a genre (description) by name/title (e.g., “Thriller”)</td>
								<td>genres/[name]</td>
								<td>GET</td>
								<td>None</td>
								<td>
									A JSON object holding Data about a genre. Example:<br>{<br>
									Name: 'genre name',<br>
									description: 'genre description' <br>}
								</td>
							</tr>
							<tr>
								<td>Return data about a director by name</td>
								<td>/directors/[name]</td>
								<td>GET</td>
								<td>None</td>
								<td>
									A JSON object holding data about a director <br /><em>e.g.:</em> Example:
									{ <br> name: "director name"<br> bio: "A film director, producer and screenwriter.", <br> born: "00.00.0000" <br> death: "-" <br> movies:"director best movies" <br>}
								</td>
							</tr>
							<tr>
								<td>Allow new users to register</td>
								<td>/users</td>
								<td>POST</td>
								<td>A JSON object holding data about the registered users <br> 
									{ <br> Username: string <br> Password: string <br> Email: string <br> Birthday: date <br> }</td>
								<td>A response indicating whether the user was successfully registered<br>A JSON object holding data about the user that was registered, inculding an ID: <br /><em>e.g.:</em> 
									{ <br> id: 1<br> username: "Name", <br> password: "password",
									<br> e-mail: "name@google.com", <br> birthday: "00.00.0000" <br> }</td>
							</tr>
							<tr>
								<td>Allow users to update their user info</td>
								<td>/users/[username]</td>
								<td>PUT</td>
								<td>None</td>
								<td>A JSON object holding data about a new user</td>
							</tr>
							<tr>
								<td>Allow users to add a movie to their list of favorites</td>
								<td>/users/[Username]/movies/[MovieID]</td>
								<td>PUT</td>
								<td>None</td>
								<td> JSON object holding data about a user favorite movies</td>
							</tr>
							<tr>
								<td>Allow users to remove a movie from their list of favorites</td>
								<td>/users/[Username]/movies/[MovieID]</td>
								<td>DELETE</td>
								<td>None</td>
								<td>JSON object holding data about a user favorite movies</td>
							</tr>
							<tr>
								<td>Allow existing users to deregister</td>
								<td>/users/[username]</td>
                <td>DELETE</td>
								<td>None</td>
								<td>A text message indicating whether the user was successfully deregistered</td>
							</tr>
						</tbody>
					</table>

### Dependencies
- bcrypt
- body-parser
- cors
- express
- express-validator
- jsonwebtoken
- mongoose
- morgan
- passport
- passport-jwt
- passport-local
- uuid

### Built with:

- Javascript 
- Node.js
- Express
- MongoDB
- Mongoose

#### and Hosted on Heroku 
