import {
    BrowserRouter,
    Routes,
    Route,
} from 'react-router-dom';

import { 
    Anchor,
    Box,
    Button,
    Footer,
    Grommet,
    Markdown,
    ResponsiveContext,
    Text,
} from 'grommet';

import {
    ContactInfo,
    Gamepad,
    Github,
    Linkedin,
    Tools,
    Youtube,
} from 'grommet-icons';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper'
import 'swiper/css';
import 'swiper/css/autoplay';

import './global.css';

import Layout from './layout.js';

const PUBLIC_URL = process.env.PUBLIC_URL;

const Theme = {
    global: {
        colors: {
            brand: 'dark-2'
        }
    }
}

function AppButton(props) {
    return (
        <Button href={props.href} hoverIndicator={true}>
            <Box direction='row' align='center'
                pad={{ horizontal: 'medium', vertical: 'small' }}>
                <Box pad={{ right: 'small' }}>{props.icon}</Box>
                <Text>{props.label}</Text> 
            </Box>
        </Button>
    );
}

function AppBar(props) {
    return (
        <Box
            direction={props.size === 'small' ? 'column' : 'row'}
            pad={{ horizontal: 'medium' }} 
            height={{ min: '100px' }} 
            align='center'
            justify='between'
            elevation='medium'
            style={{ zIndex: '10' }}> 

            <a href='/'>
                <img alt='yostlabs'
                    src={PUBLIC_URL+'logo.svg'}
                    width={128}
                    height={48}/>
            </a>

            <Box direction='row'>
                <AppButton
                    icon={<Gamepad/>}
                    label='Demos'
                    href='/demo'/>
                <AppButton
                    icon={<Tools/>}
                    label='Woodwork'
                    href='/wood'/>
                <AppButton
                    icon={<ContactInfo/>}
                    label='About'
                    href='/about'/>
            </Box>
        </Box>
   );
}

function AppSlides(props) {
    return (
        <Swiper modules={[Autoplay]} autoplay className='fill'>

            {props.slides.map(datum => (
                <SwiperSlide>
                    <a href={datum.href}>
                        <Box fill>
                            <img 
                                src={PUBLIC_URL+datum.src}
                                alt={datum.label}
                                className='img-fit'/>

                            { datum.label && 
                                <Box pad='small' align='center' justify='center' background='light-2'>
                                    <Text className='slide'>{datum.label}</Text>
                                </Box>
                            }
                        </Box>
                    </a>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}

function AppFooter() {
    return (
        <Footer align='center' justify='center' border='top'>
            <Anchor href='https://github.com/danstuff' 
                icon={<Github size='large'/>}/>
            <Anchor href='https://linkedin.com/in/danyost23' 
                icon={<Linkedin size='large'/>}/>
            <Anchor href='https://www.youtube.com/channel/UC-sw1y_rTgRLysS2FgYSfqA'
                icon={<Youtube size='large'/>}/>
        </Footer>
    );
}

function AppBody(props) {
    return (
        <Grommet theme={Theme} full>
        <Box fill>
            <ResponsiveContext.Consumer>
                {size => (<AppBar size={size}/>)}
            </ResponsiveContext.Consumer>
 
            { props.slides &&
                <AppSlides slides={props.slides}/> }
            { props.markdown &&
                <Box height={{ min: '200px' }} pad={{ horizontal: 'large' }}>
                    <Markdown>{props.markdown}</Markdown>
                </Box>
            }

            <AppFooter/>
        </Box>
        </Grommet>
    );
}

function App(props) {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/'
                    element={
                        <AppBody 
                            slides={Layout.pages[0].slides}
                            markdown={Layout.pages[0].markdown}/>
                    }
                />

                { Layout.pages.map(datum => (
                    <Route path={datum.name}
                        element={
                            <AppBody 
                                slides={datum.slides}
                                markdown={datum.markdown}/>
                        }
                    />
                )) }
            </Routes>
        </BrowserRouter>
    );
}

export default App;
