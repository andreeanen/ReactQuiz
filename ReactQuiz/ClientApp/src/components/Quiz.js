﻿import React from 'react';
import { QuizQuestion } from './QuizQuestion.js';
import { QuizFinish } from './QuizFinish.js';

let quizData = require('./QuizData.json') //fetch

export class Quiz extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            error: null,
            isLoaded: false,
            quizData: [],
            position: 1,
            isAnswered: false,
            incorrectAnswer: false,
            points: 0
        }
    }

    componentDidMount() {
        fetch('api/questions')
            .then(response => response.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        quizData: result
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    showNextQuestion = () => {
        this.setState({
            position: this.state.position + 1,
            isAnswered: false
        });
    }

    handleResetClick = () => {
        this.setState({ position: 1, points: 0 });
    }

    handleAnswerQuestion = (buttonText) => {

        if (!this.state.isAnswered) {

            if (buttonText === quizData[this.state.position - 1].correctAnswer) {

                this.setState({ incorrectAnswer: false, points: this.state.points + 1 });
            }
            else {
                this.setState({ incorrectAnswer: true });
            }
            this.setState({ isAnswered: true });
        }
    }


    render() {
        const isQuizFinished = ((this.state.position - 1) === quizData.length)
        const { error, isLoaded, activities } = this.state;

        if (error) {
            return <div>Error: {error.message}</div>
        }
        else if (!isLoaded) {
            return (
                <div className="ui segment">
                    <div className="ui active transition visible inverted dimmer">
                        <div className="content"><div className="ui large text loader">Loading</div></div>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div>
                    {isQuizFinished ?
                        <QuizFinish resetClickHandler={this.handleResetClick} showPointsHandler={this.state.points} /> :
                        <QuizQuestion showNextQuestionHandler={this.showNextQuestion} handleAnswerQuestion={this.handleAnswerQuestion} isAnswered={this.state.isAnswered}
                            quizQuestion={quizData[this.state.position - 1]} incorrectAnswer={this.state.incorrectAnswer} />}
                </div>
            )
        }        
    }
}