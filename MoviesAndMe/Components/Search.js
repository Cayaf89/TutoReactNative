// Components/Search.js
import React from 'react'
import { StyleSheet, View, TextInput, Button, ActivityIndicator } from 'react-native'
import { getFilmsFromApiWithSearchedText } from '../API/TMDBApi'
import { connect } from 'react-redux'
import FilmList from './FilmList'

class Search extends React.Component {

    constructor(props) {
        super(props);
        this.searchedText = ""
        this.page = 0
        this.totalPages = 0
        this.state = {
            films: [],
            isLoading: false
        }
    }

    _searchFilms() {
        this.page = 0
        this.totalPages = 0
        this.setState({
            films: []
        },
            this._loadFilms)

    }

    _loadFilms = () => {
        if (this.searchedText.length > 0) {
            this.setState({ isLoading: true });
            getFilmsFromApiWithSearchedText(this.searchedText, this.page + 1).then(data => {
                this.page = data.page;
                this.totalPages = data.total_pages;
                this.setState({
                    films: [...this.state.films, ...data.results],
                    isLoading: false
                });
            });
        }
    }

    _searchTextInputChanged(text) {
        this.searchedText = text;
    }

    _displayLoading() {
        if (this.state.isLoading) {
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size="large" />
                </View>
            );
        }
    }

    render() {
        return (
                <View style={styles.main_container}>
                    <TextInput
                        style={styles.textinput}
                        placeholder='Titre du film'
                        onChangeText={(text) => this._searchTextInputChanged(text)}
                        onSubmitEditing={() => this._searchFilms()}
                    />
                    <Button title='Rechercher' onPress={() => this._searchFilms()} />
                    <FilmList
                        films={this.state.films}
                        navigation={this.props.navigation}
                        isFavoriteList={false}
                        page={this.page}
                        totalPages={this.totalPages}
                        loadFilms={this._loadFilms}
                    />
                    {this._displayLoading()}
                </View>
        );
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 100,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textinput: {
        marginLeft: 5,
        marginRight: 5,
        height: 50,
        borderColor: '#000000',
        borderWidth: 1,
        paddingLeft: 5
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

export default connect(mapStateToProps, mapDispatchToProps)(Search)