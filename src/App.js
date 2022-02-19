import { 
    Box,
    Button,
    Grommet,
    ResponsiveContext,
    Stack,
    Text,
} from 'grommet';

import {
    ContactInfo,
    Gamepad,
    Tools,
} from 'grommet-icons';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper'
import 'swiper/css';
import 'swiper/css/autoplay';

import './global.css';

import Layout from './layout.json';

const PUBLIC_URL = process.env.PUBLIC_URL;

const Theme = {
    global: {
        font: {
            family: 'sans-serif'
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
            align='center'
            justify='between'
            pad={{ horizontal: 'medium', vertical: 'small' }}
            elevation='medium'
            style={{ zIndex: '10' }}> 

            <img alt='yostlabs'
                src={PUBLIC_URL+'logo.svg'}
                width={128}
                height={48}/>

            <Box direction='row'>
                <AppButton
                    icon={<Gamepad/>}
                    label='Demos'
                    href='/demos'/>
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

function App() {

    return (
        <Grommet theme={Theme} full>
        <Box fill>
            <ResponsiveContext.Consumer>
                {size => (<AppBar size={size}/>)}
            </ResponsiveContext.Consumer>

            <Swiper modules={[Autoplay]} autoplay className='fill'>
                {Layout.index.slides.map(datum => (
                    <SwiperSlide>
                    <Box fill>
                        <Box className='img-box'>
                            <img src={PUBLIC_URL+'woodwork/oak_trays/0.jpg'} 
                                className='img-fit'/>
                        </Box>
                        <Box height='xsmall' align='center' justify='center'>
                        <Text className='slide'>{datum.label}</Text>
                        </Box>
                    </Box>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
        </Grommet>
    );
}

export default App;
