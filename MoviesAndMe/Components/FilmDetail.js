// Components/FilmDetail.js

import React from 'react'
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, Image, TouchableOpacity, Share, Platform } from 'react-native'
import moment from 'moment'
import numeral from 'numeral'
import { getFilmDetailFromApi, getImageFromApi } from '../API/TMDBApi'
import { connect } from 'react-redux'
import EnlargeShrink from '../Animations/EnlargeShrink'

class FilmDetail extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state
        // On accède à la fonction shareFilm et au film via les paramètres qu'on a ajouté à la navigation
        if (params.film != undefined && Platform.OS === 'ios') {
            return {
                // On a besoin d'afficher une image, il faut donc passe par une Touchable une fois de plus
                headerRight: <TouchableOpacity
                    style={styles.share_touchable_headerrightbutton}
                    onPress={() => params.shareFilm()}>
                    <Image
                        style={styles.share_image}
                        source={require('../Images/ic_share.png')} />
                </TouchableOpacity>
            }
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            film: undefined,
            isLoading: true
        }
    }

    // Fonction pour faire passer la fonction _shareFilm et le film aux paramètres de la navigation.
    // Ainsi on aura accès à ces données au moment de définir le headerRight
    _updateNavigationParams() {
        this.props.navigation.setParams({
            shareFilm: this._shareFilm,
            film: this.state.film
        })
    }

    componentDidMount() {
        const favoriteFilmIndex = this.props.favoritesFilm.findIndex(item => item.id === this.props.navigation.state.params.idFilm)
        if (favoriteFilmIndex !== -1) {
            this.setState({
                film: this.props.favoritesFilm[favoriteFilmIndex],
                isLoading: false
            }, () => { this._updateNavigationParams() })
            return
        }
        getFilmDetailFromApi(this.props.navigation.state.params.idFilm).then(data => {
            this.setState({
                film: data,
                isLoading: false
            }, () => { this._updateNavigationParams() })
        })
    }

    _toggleFavorite() {
        const action = { type: 'TOGGLE_FAVORITE', value: this.state.film }
        this.props.dispatch(action)
    }

    _shareFilm = () => {
        const { film } = this.state
        Share.share(
            {
                title: film.title,
                message: film.overview
            }
        )
    }

    _displayLoading() {
        if (this.state.isLoading) {
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size="large" />
                </View>
            )
        }
    }

    _displayFavoriteImage() {
        var sourceImage = require('../Images/ic_favorite_border.png')
        var shouldEnlarge = false
        if (this.props.favoritesFilm.findIndex(item => item.id === this.state.film.id) !== -1) {
            // Film dans nos favoris
            sourceImage = require('../Images/ic_favorite.png')
            shouldEnlarge = true
        }
        return (
            <EnlargeShrink 
                shouldEnlarge={shouldEnlarge}>
                <Image
                    style={styles.favorite_image}
                    source={sourceImage}
                />
            </EnlargeShrink>
        )
    }

    _displayFloatingActionButton() {
        const { film } = this.state
        if (film != undefined && Platform.OS === 'android') { // Uniquement sur Android et lorsque le film est chargé
            return (
                <TouchableOpacity
                    style={styles.share_touchable_floatingactionbutton}
                    onPress={() => this._shareFilm()}>
                    <Image
                        style={styles.share_image}
                        source={require('../Images/ic_share.png')} />
                </TouchableOpacity>
            )
        }
    }

    _displayFilm() {
        if (this.state.film != undefined) {
            const film = this.state.film
            return (
                <ScrollView style={styles.scrollview_container}>
                    <Image
                        style={styles.image}
                        source={{ uri: getImageFromApi(film.backdrop_path) }}
                    />
                    <Text style={styles.title_text}>{film.title}</Text>
                    <TouchableOpacity
                        style={styles.favorite_container}
                        onPress={() => this._toggleFavorite()}>
                        {this._displayFavoriteImage()}
                    </TouchableOpacity>
                    <Text style={styles.overview_text}>{film.overview}</Text>
                    <Text style={styles.default_text}>Sorti le {moment(film.release_date).format('DD/MM/YYYY')}</Text>
                    <Text style={styles.default_text}>Note : {film.vote_average} / 10</Text>
                    <Text style={styles.default_text}>Nombre de votes : {film.vote_count}</Text>
                    <Text style={styles.default_text}>Budget : {numeral(film.budget).format('0,0[.]00 $')}</Text>
                    <Text style={styles.default_text}>Genre(s) : {Array.from(film.genres, genre => genre.name).join(' / ')}</Text>
                    <Text style={styles.default_text}>Companie(s) : {Array.from(film.production_companies, company => company.name).join(' / ')}</Text>
                </ScrollView>
            )
        }
    }


    render() {
        return (
            <View style={styles.main_container}>
                {this._displayLoading()}
                {this._displayFilm()}
                {this._displayFloatingActionButton()}
            </View>
        )
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
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    scrollview_container: {
        flex: 1
    },
    image: {
        flex: 1,
        height: 169
    },
    title_text: {
        flex: 1,
        fontSize: 35,
        fontWeight: 'bold',
        flexWrap: 'wrap',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        marginBottom: 10,
        color: '#000000',
        textAlign: 'center',
    },
    overview_text: {
        fontStyle: 'italic',
        color: '#666666',
        margin: 5,
        marginBottom: 15
    },
    default_text: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5
    },
    favorite_container: {
        alignItems: 'center',
    },
    favorite_image: {
        flex: 1,
        width: null,
        height: null
    },
    share_touchable_floatingactionbutton: {
        position: 'absolute',
        width: 60,
        height: 60,
        right: 30,
        bottom: 30,
        borderRadius: 30,
        backgroundColor: '#e91e63',
        justifyContent: 'center',
        alignItems: 'center'
    },
    share_image: {
        width: 30,
        height: 30
    },
    share_touchable_headerrightbutton: {
        marginRight: 8
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

export default connect(mapStateToProps, mapDispatchToProps)(FilmDetail)