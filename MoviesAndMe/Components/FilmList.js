import React from 'react'
import { FlatList, StyleSheet} from 'react-native'
import FilmItem from './FilmItem'
import { connect } from 'react-redux'

class FilmList extends React.Component {

    _isFilmInFavorite(idFilm) {
        return this.props.favoritesFilm.findIndex(film => film.id === idFilm) !== -1
    }

    _displayDetailForFilm = (idFilm) => {
        this.props.navigation.navigate("FilmDetail", { idFilm: idFilm })
    }

    render() {
        return (
            <FlatList
                style={styles.list}
                data={this.props.films}
                keyExtractor={(item) => item.id.toString()}
                extraData={this.props.favoritesFilm}
                renderItem={({ item }) => (
                    <FilmItem
                        film={item}
                        displayDetailForFilm={this._displayDetailForFilm}
                        isFilmInFavorite={this._isFilmInFavorite(item.id)}
                    />
                )}
                onEndReachedThreshold={0.5}
                onEndReached={() => {
                    if (!this.props.isFavoriteList && this.props.page < this.props.totalPages) {
                        this.props.loadFilms()
                    }
                }}
            />
        );
    }
}

const styles = StyleSheet.create({
    list: {
        flex: 1
    }
})

const mapStateToProps = (state) => {
    return {
        favoritesFilm: state.favoritesFilm
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch: (action) => { dispatch(action) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FilmList)