 import React from 'react'
 import PropTypes from 'prop-types'
 import { fetchPopularRepos } from '../utils/api'

 function LanguageNav ({ selected, onUpdateLanguage}) {
     const languages = ['All', 'Javascript', 'Ruby', 'Java', 'CSS', 'Python'];
     return (
         <ul className='flex-center'>
             {languages.map((language) => (
                 <li key={language}>
                     <button
                         className='btn-clear nav-link'
                         style={language === selected ? {color: 'rgb(187, 46, 31)'} : null}
                         onClick={() => onUpdateLanguage(language)}>
                         {language}
                     </button>
                 </li>
             ))}
         </ul>
     )
 }

 LanguageNav.propTypes = {
    selected: PropTypes.string.isRequired,
    onUpdateLanguage:  PropTypes.func.isRequired
 }

 export default class Popular extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedLanguage: 'All',
            repos: null,
            error: null
        }

        this.updateLanguage = this.updateLanguage.bind(this)
        this.isLoading = this.isLoading.bind(this)
    }

     componentDidMount() {
         this.updateLanguage(this.state.selectedLanguage)
     }

    updateLanguage (selectedLanguage) {
        this.setState({
            selectedLanguage: selectedLanguage,
            repos: null,
            error: null
        })

        fetchPopularRepos(selectedLanguage)
            .then((repos) => this.setState({
                repos: repos,
                error: null
            })).catch((error) => {
                console.warn('Error fetching repos:', error)
                this.setState({
                    repos: null,
                    error: error
                })
            })
    }

    isLoading() {
        return this.state.repos == null && this.state.error == null
    }

     render() {
        const { selectedLanguage, repos, error } = this.state
        return (
            <React.Fragment>
                <LanguageNav
                    selected={ selectedLanguage }
                    onUpdateLanguage={ this.updateLanguage }
                />

                { this.isLoading() && <p>LOADING</p> }

                { error && <p>{error.message}</p> }

                { repos && <pre>{JSON.stringify(repos, null, 2)}</pre>}
            </React.Fragment>
        )
    }
 }