import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button } from 'antd';

import { createSession, getUserPool } from '../Services/UserPool';
import '../Styles/Authentication.css';
import '../Styles/Verification.css';
import { functionURL } from '../Constant/functionURL';
import axios from "axios";

function Verification() {

    const navigate = useNavigate()

    const [question, setQuestion] = useState({
        type: "Q1",
        question: "What is the name of the street where you grew up?"
    });
    const [questions,] = useState([
        {
            type: "Q1",
            question: "What is the name of the street where you grew up?"
        },
        {
            type: "Q2",
            question: "What is the name of your favorite fictional character?"
        },
        {
            type: "Q3",
            question: "What is the name of your favorite teacher?"
        }
    ]);


    const initialValues = {
		answer1:'', answer2:'', answer3:''
	};

    const initialAnswersValid = {
       answer1:true, answer2:true, answer3:true
    }


    const [answers, setAnswers] = useState(initialValues);

    const [email, setEmail] = useState('');
    const [answer, setAnswer] = useState('');
    const [isAnswerValid, setIsAnswerValid] = useState(true);
    const [isAnswersValid, setIsAnswersValid]  = useState(initialAnswersValid);

    const [isUserVerified, setIsUserVerified] = useState(false);

    const handleChange = (e) => {
		const { name, value } = e.target;
		setAnswers({ ...answers, [name]: value });
        if(value === ''){
            setIsAnswersValid({...isAnswersValid,[name] : false});
        }
	};

    const handleNameChange = (value) => {
        setAnswer(value)
        if (value === '') {
            setIsAnswerValid(false)
            return;
        }
        setIsAnswerValid(true)
    }

    // const handleAnswer1Change = (value) => {
    //     setAnswer1(value)
    //     if (value === '') {
    //         setIsAnswer1Valid(false)
    //         return;
    //     }
    //     setIsAnswer1Valid(true)
    // }

    // const handleAnswer2Change = (value) => {
    //     setAnswer2(value)
    //     if (value === '') {
    //         setIsAnswer2Valid(false)
    //         return;
    //     }
    //     setIsAnswer2Valid(true)
    // }

    // const handleAnswer3Change = (value) => {
    //     setAnswer3(value)
    //     if (value === '') {
    //         setIsAnswer3Valid(false)
    //         return;
    //     }
    //     setIsAnswer3Valid(true)
    // }


    const sendMail = async (e) => {
//     try {
//       await axios({
//         method: "post",
//         url: `https://wlfhjj5a5a.execute-api.us-east-1.amazonaws.com/game/sns-subs?emailID=${email}`, 
//         data: {
//           email: email,
//         },
//         headers: {
//           "Content-type": "application/json",
//         },
//       })
//         .then((res) => {
//           if (res.data.statusCode === 200) {
//             console.log("Subscribed Success")// change this path to the verify q and a.
//           }
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//       // navigate(path.VERIFY_Q_AND_A);
//     } catch (error) {
//       console.log(error);
//     }

        try {
            const response = await axios.get(`https://wlfhjj5a5a.execute-api.us-east-1.amazonaws.com/game/send-mail?emailID=${email}`);
            if (response.status === 200) {
                console.log("Subscribed Success")
            }
        } catch (error) {
        console.error('Error fetching user teamname:', error);
        }
    };


    const onSubmit = async () => {
        if (isUserVerified) {
            if (answer === '') {
                setIsAnswerValid(false)
                return;
            }
            if (isAnswerValid) {
                console.log(answer);
                console.log(question.type);
                const response = await fetch(functionURL + "verifyIdentity", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "email": email,
                        "question": question.type,
                        "answer": answer
                    })
                })

                const data = await response.json();
                console.log(data)

                        if (data.status === "Success") {
                            localStorage.setItem('verified', 'true');

                            if(email==="admin@gmail.com"){
                                localStorage.setItem("isAdmin","true");
                                navigate('/admin/categories');
                            }else{
                                localStorage.setItem("isAdmin","false");
                                navigate('/profile');
                            }
                        } else {
                            alert(data.message);
                        }       
            }
        } else {
            if (answers.answer1 === '') {
                setIsAnswersValid.answer1 = false
                return;
            }
            if (answers.answer2 === '') {
                setIsAnswersValid.answer2 = false
                return;
            }
            if (answers.answer3 === '') {
                setIsAnswersValid.answer3 = false
                return;
            }
            
                await fetch(functionURL + "createIdentity", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "email": email,
                        "Q1": {
                            "question": "What is the name of the street where you grew up?",
                            "answer": answers.answer1
                        },
                        "Q2": {
                            "question": "What is the name of your favorite fictional character?",
                            "answer": answers.answer2
                        },
                        "Q3": {
                            "question": "What is the name of your favorite teacher?",
                            "answer": answers.answer3
                        }
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === "Success") {
                            console.log(data);
                            localStorage.setItem('verified', 'true');
                            sendMail();
                            navigate('/profile');
                        } else {
                            alert(data.message);
                        }
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            
        }
    }

    useEffect(() => {
        async function getSession() {
            // await setIsLoading(true);
            await createSession(localStorage.getItem('token'), localStorage.getItem('idToken'));
            const userPool = await getUserPool();
            const currentUser = await userPool.getCurrentUser();
            await currentUser.getSession(async (err, session) => {
                if (err) {
                    console.log(err);
                } else {
                    const payload = await session.getIdToken().decodePayload();
                    const email = await payload.email;
                    setEmail(email);
                    console.log(email);
                    isUserRegistered(email);
                }
            })
        }
        getSession();
    }, [])

    const isUserRegistered = async (email) => {
        const response = await fetch(functionURL + "getUserStatus/" + email, {
            method: 'GET'
        })

        const data = await response.json();
        console.log(data)
          
           
            //     if (response.status === 200) {
            //         // console.log(response)
            //         console.log(response.json())
                    if (data.userRegistered) {
                        console.log(questions[Math.floor(Math.random() * 3)]);
                         setQuestion(questions[Math.floor(Math.random() * 3)])
                         setIsUserVerified(true);
                        // console.log(data);
                    } else {
                         setIsUserVerified(false);
                        // console.log(data);
                    }
            //     }
            
            // .catch((error) => {
            //     // setIsLoading(false);
            //     console.error('Error:', error);
            // });
    }



    return (
            <div className='container'>
                <p className='title'>Verify Yourself</p>
                <div>
                    {
                        isUserVerified ?
                            <>
                                <p className="verification-question">{question.question}</p>
                                <Input status={isAnswerValid ? 'Success' : 'error'} value={answer} onChange={(e) => handleNameChange(e.target.value)} size='large' placeholder="Answer" className='mb-10' />
                                <p className='registration-error-message' style={{ display: isAnswerValid ? 'none' : 'block' }}>Answer can't be empty.</p>
                                <Button className='registration-submit' size='large' onClick={() => onSubmit()} >Submit</Button>
                            </>
                            :
                            <>
                            
                                <p className="verification-question">{questions[0].question}</p>
                                <Input required name = "answer1"  status={isAnswersValid.answer1 ? 'Success' : 'error'} value={answers.answer1} onChange={(e) => handleChange(e)} size='large' placeholder="Answer" className='mb-10' />
                                <p style={{ display: isAnswersValid.answer1 ? 'none' : 'block' }} className='registration-error-message' >Answer can't be empty.</p>
                                <p className="verification-question">{questions[1].question}</p>
                                <Input required name = "answer2"  status={isAnswersValid.answer2 ? 'Success' : 'error'} value={answers.answer2} onChange={(e) => handleChange(e)} size='large' placeholder="Answer" className='mb-10' />
                                <p style={{ display: isAnswersValid.answer2 ? 'none' : 'block' }} className='registration-error-message' >Answer can't be empty.</p>
                                <p className="verification-question">{questions[2].question}</p>
                                <Input required name = "answer3"  status={isAnswersValid.answer3 ? 'Success' : 'error'} value={answers.answer3} onChange={(e) => handleChange(e)} size='large' placeholder="Answer" className='mb-10' />
                                <p style={{ display: isAnswersValid.answer3 ? 'none' : 'block' }} className='registration-error-message' >Answer can't be empty.</p>
                                <Button className='registration-submit' size='large' onClick={() => onSubmit()} >Submit</Button>
                            </>
                    }
                </div>
            </div>
        
    );
}

export default Verification;
