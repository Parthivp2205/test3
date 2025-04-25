import streamlit as st
import pickle
import requests

# Configure Streamlit page
st.set_page_config(layout="wide", page_title="Movie Paradise", page_icon="🎬")

# Load custom CSS
with open('style.css') as f:
    st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)

def fetch_poster(movie_id):
    url = "https://api.themoviedb.org/3/movie/{}?api_key=c7ec19ffdd3279641fb606d19ceb9bb1&language=en-US".format(movie_id)
    data=requests.get(url)
    data=data.json()
    poster_path = data['poster_path']
    full_path = "https://image.tmdb.org/t/p/w500/"+poster_path
    return full_path

def fetch_movie_details(movie_id):
    url = "https://api.themoviedb.org/3/movie/{}?api_key=c7ec19ffdd3279641fb606d19ceb9bb1&language=en-US".format(movie_id)
    data=requests.get(url)
    return data.json()

movies = pickle.load(open("movies_list.pkl", 'rb'))
similarity = pickle.load(open("similarity.pkl", 'rb'))
movies_list = movies['title'].values

# Navigation Bar
st.markdown("""
    <nav class="navbar">
        <div class="nav-logo">
            <h1>Movie Paradise</h1>
        </div>
        <div class="nav-links">
            <a href="#" class="active">Home</a>
            <a href="#">Movies</a>
            <a href="#">TV Shows</a>
            <a href="#">New</a>
            <a href="#">My List</a>
        </div>
        <div class="nav-right">
            <div class="search-icon">
                <i class="fas fa-search"></i>
            </div>
            <div class="profile-icon">
                <i class="fas fa-user-circle"></i>
            </div>
        </div>
    </nav>
""", unsafe_allow_html=True)

# Featured Content Section
featured_movie = movies[movies['title'] == 'Dune'].iloc[0]  # Get Dune as featured movie  # Get the first movie as featured
featured_details = fetch_movie_details(featured_movie['id'])
featured_poster = fetch_poster(featured_movie['id'])

st.markdown(f"""
    <div class="hero-section" style="background-image: url('{featured_poster}')">
        <div class="hero-content">
            <h1 class="hero-title">{featured_movie['title']}</h1>
            <div class="hero-metadata">
                <span class="rating"><i class="fas fa-star"></i> {featured_details.get('vote_average', 0)}</span>
                <span class="year"><i class="fas fa-calendar"></i> {featured_details.get('release_date', '')[:4]}</span>
                <span class="duration"><i class="fas fa-clock"></i> {featured_details.get('runtime', '')} min</span>
            </div>
            <p class="hero-description">{featured_details.get('overview', '')[:200]}...</p>
            <div class="hero-buttons">
                <button class="play-btn"><i class="fas fa-play"></i> Watch Now</button>
                <button class="more-info-btn">More Info</button>
            </div>
        </div>
    </div>
""", unsafe_allow_html=True)

# Movie Recommendation Section Header
st.markdown('<h2 class="section-title">Movie Recommendation</h2>', unsafe_allow_html=True)

# Search Section
st.markdown('<div class="search-section">', unsafe_allow_html=True)
search_query = st.text_input("", placeholder="Search for movies...", key="movie_search")
st.markdown('</div>', unsafe_allow_html=True)

# Recommendations Section
if len(search_query) >= 3:
    filtered_movies = [movie for movie in movies_list if search_query.lower() in movie.lower()]
    if filtered_movies:
        selected_movie = st.selectbox("Select a movie", filtered_movies, key="movie_select")
        if st.button("Get Recommendations", key="recommend_button"):
            st.markdown(f"<h2 class='section-title'>Recommendations for {selected_movie}</h2>", unsafe_allow_html=True)
            
            def recommend(movie):
                index = movies[movies['title']==movie].index[0]
                distance = sorted(list(enumerate(similarity[index])), reverse=True, key=lambda vector:vector[1])
                recommend_movies = []
                
                for i in distance[1:7]:
                    movie_data = movies.iloc[i[0]]
                    movie_id = movie_data.id
                    details = fetch_movie_details(movie_id)
                    recommend_movies.append({
                        'title': movie_data.title,
                        'poster': fetch_poster(movie_id),
                        'rating': details.get('vote_average', 0),
                        'year': details.get('release_date', '')[:4],
                        'overview': details.get('overview', '')[:150]
                    })
                return recommend_movies
            
            recommendations = recommend(selected_movie)
            
            # Display recommendations in a list view
            st.markdown('<div class="movie-list">', unsafe_allow_html=True)
            for movie in recommendations:
                st.markdown(f"""
                    <div class="movie-list-item">
                        <div class="movie-poster">
                            <img src="{movie['poster']}" alt="{movie['title']}">
                        </div>
                        <div class="movie-details">
                            <h3>{movie['title']}</h3>
                            <div class="movie-metadata">
                                <span class="rating">★ {movie['rating']}</span>
                                <span class="year">{movie['year']}</span>
                            </div>
                            <p class="movie-description">{movie['overview']}</p>
                        </div>
                    </div>
                """, unsafe_allow_html=True)
            st.markdown('</div>', unsafe_allow_html=True)

# Trending Section
st.markdown("<h2 class='section-title'>Trending Now</h2>", unsafe_allow_html=True)
trending_movies = [
    "Inception",
    "The Shawshank Redemption",
    "The Dark Knight",
    "Top Gun: Maverick",
    "Spider-Man: No Way Home",
    "Titanic",
    "The Twilight Saga: New Moon"
]

st.markdown('<div class="movie-list">', unsafe_allow_html=True)
for movie_title in trending_movies:
    movie_data = movies[movies['title'] == movie_title].iloc[0]
    details = fetch_movie_details(movie_data['id'])
    st.markdown(f"""
        <div class="movie-list-item">
            <div class="movie-poster">
                <img src="{fetch_poster(movie_data['id'])}" alt="{movie_title}">
            </div>
            <div class="movie-details">
                <h3>{movie_title}</h3>
                <div class="movie-metadata">
                    <span class="rating">★ {details.get('vote_average', 0)}</span>
                    <span class="year">{details.get('release_date', '')[:4]}</span>
                </div>
                <p class="movie-description">{details.get('overview', '')[:150]}...</p>
            </div>
        </div>
    """, unsafe_allow_html=True)
st.markdown('</div>', unsafe_allow_html=True)

# Footer
st.markdown("""
    <footer class="footer">
        <p>© 2024 Movie Paradise | Powered by TMDB API</p>
    </footer>
""", unsafe_allow_html=True)
