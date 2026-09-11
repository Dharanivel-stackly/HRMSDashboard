import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm'
import { OtpVerificationForm } from '@/features/auth/components/OtpVerificationForm'
import type {
  ForgotPasswordFormData,
  OtpFormData,
} from '@/features/auth/validation/auth.schema'
import { authService } from '@/features/auth/services/authService'
import { ROUTES } from '@/lib/constants/routes'
import { appConfig } from '@/config/app.config'
import { Button } from '@/components/ui/button'

const DUMMY_OTP = '123456'
const OTP_STORAGE_KEY = 'forgot-password-otp'

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [email, setEmail] = useState('')
  const [showOtp, setShowOtp] = useState(false)
  const [otpError, setOtpError] = useState<string | null>(null)


  // const handleSubmit = async (data: ForgotPasswordFormData) => {
  //   setIsLoading(true)
  //   try {
  //     await authService.forgotPassword(data)
  //     // Like it's not like start so login screen ofplays current share in springs like a sample log in last episode complete like person tick to lack to already play no play mit remove log in material actually so good you can put to the gate we will because we all can see the go round short sure for I completed it after starting it I have added it once code he access you I will get I will copy paste the code arts I didn't get you for password I have added the screens in existing code once I will get this new code I will copy paste it yes there is email p no I have added a static data there no this was static yeah okay I will push it pro you just just make it some changes are available try that one time because seven screen is not completed this is the first screen then we have second screen is yes one minute under seven images of yes first frame is a signing then enter your password then two factor verification then for sword then check your email they also enter your password then this account is lock and then urece you are doing like actually you have covered all the all the things there is no target password page is there I think actually you develop this one yeah I will use the forgotten pause for screen once I send recycling if we will go through the main screen all the seven script can be completed actually did you use any a for this yeah I have used with the help of chat GPT I have spreom you or normal actually you did very well like this is not an SVG images this is just a code when we get the they have not if uses not received that image is partly there any way right yeah yes yeah that part is totally going to change working for it yes yeah so that right now you are will design it the redesign that sign in pace so that part is okay I'm just sharing on the okay what is the we can receive the update and then we can share it to the update actually wigness is checking the real repo which was shared by actually he is checking in it actually there push the go to the game because it and then know about it yeah in which branch I I will like dev dev yeah stop actually I forgot one person to act nesh also from my team also vigilants actually more over let's let's first see the older sticker once he push the core we can able to explore the codes and fold the structures and all and then wickness is going to have meat with packet number as well as let's ensure that whether they have completed APS and or we can move to the real repos which our sharp once is and then we can start to work actually very great and is doing good so that's the good thing yeah we are also happy with that yes he's going he is doing only he's doing everyone every page from the second page you also have to give me option to prove my team also I have also two associates they are good with the designs and everything broke self okay so journey is he able to present the screen yeah sure doing one page I think so got it Pratab you're creating forget page forward password I have completed it first you check that after there is any issue after that we can just actually video and check the folder specification we can able to like I have waited in each step for each steps I have created thirty lines of code in each folder like it will be simply similar to VD code which means that each UI you have created a separate component yeah separate component it is easy to deploy so that's why I yeah that's good actually our folder project folder structure varies from this folder structure that all we can able to discuss with Vnash once we all can explore the code of you done right now after that we can host it using vessel or a netclify whatever it is and then end of the day we can show it to approval just a mini guys is coming what about your team made a lex of the left higness hi actually darling girl has all like you have created a real slide is very bass like what is using I think he's using a Chat Pro using like ChatGPT plus cloud plus POS three I am using per UA compare I use like P model it is most of the pages are covered yeah UDM all still under processing so we have like he has completed everything right now it's about static actually what was the meeting you on with back and team is there any set of time and we'll connect afterwards to take the lunch break actually banana brongla and go down the getting to push plan elano access and the founder sexual change at the end of the day ghost if fold structure and official land postp and bags scored tribal meeting at the control the back and team reconnected API and the level about application up to log in yeah like the application is also responsive I think mobile I think mobile it will not like up to target if we correct okay no issue why you will steam provided that the mobile size design and the risk of service design this is the applicable for mobile application we have separate developers la which is react native you know like for the website side when we when someone opens the website and the mobile site we also make it make it so that the issue here so it's okay I can take that for the later part I have one point you can just connect with the UI extreme and just tell them you have to create also mobile size design like for the res but they are not providing like that we need to make it like ourselves yeah they didn't do that because the mobile application that's a complete different set up for the mobile application but responsive will be in our hands like the developer hands we need to choose our responsiveness for responsors we can make till what I mean the tablet only no for mobile it we make too difficult yeah it will be difficult but I don't this application I guess it is from last tablet only from mobile it's mobile it will be different like we need more designs also have we have to add yeah like I didn't know about this company but in my previous company we all working together and it comes to the mobile side now pigment is a provider for the website designs website designs can be provided only for mobile for till responsibility tablet we can develop it for the mobile we need the pixels image will be different yeah it will be differ completed like side bars or gold inside the menu button like that okay it's up to like we can make it up to tablet and if paper ask about it they will let her know about that now the design is support to you for and also we need to connect to the back and team like I have message ahead and you will tell the timings. I'm waiting for this message tells anything about the p then we need to work on the apat by tomorrow yesterday is. not enough for that and tomorrow shall proach the main folders with the github official gitup from tomorrow from tomorrow we need to set the correct police structure with the exit like the power structure I have provided you yes we need to follow this so. meeting advance so I will ask him about that we will we proceed for the poll structure for today we have something to show to appoint yeah so we will like with the live after hosting it in the public environment like we can share end of five thirty six yeah we will share it at the time and also look everything really like if there is any mistake we can change that only after pushing the code to git we all can access it so umbrow you can then proceed with that like sure once I complete yeah suggestions need to share to the robots from my side no it's clear from my side then as you shall continue push the code to the game wickness have a meeting with se and back ante after that from tomorrow onwards we can continue the actual unfold restructure and on right wickness to sing in and sign up for APIs are ready twenty back and ready to have received the repo from the I have received like I have accessed it now and I need to ask some doubts about that and also the backend team I have some doubts about the API part like we are having to separate repository for back end pen and how we can connect the API with the penton I have doubt about that I think they set up the local we need to run it in the local I think both the Rakus we need to run so only we yeah if it runs the both the drafter we need to have Java back and also we need to we need DB also for running local that's why I need to ask to because Van Shi also by creating the database like that in the devop site so they have centralized the database I think so if it's possible we can get that and migrate the database to our local setup they can add it in development server you know we can fetch from there also we need not to add a database in the development source directly from development server we need not to add a backend code and database from our yeah that's that's what I need to ask to them and I'll let you know about that after I complete meetings you will connect after around four thirty or five so have you only still lunch you have do what would you have come to the stuffdo this have you all completed going to do so take care you start all go right the nival and device to the you are not giving time for the lunch to your associates four thirty four number spanish actually post pink by the day share puning yes you understand what I am but I can't speak that little bit now I think to the onlyare you guys speaking and whether youam from Karnataka from Gulberg the nearest to Bangley Sin Canada has stayed in Bangladesh seventy seven years so I think southern half and every show in a language I think you already have the Hentage Prince actually you have computed with your associates HR assurance plan you try to do the demo is that possible maybe today or tomorrow so you think so you I don't know anything rights to the team and you yeah I just want to know how your team made computed the task I mean their knowledge answer to theso they don't misunderstand that I think there's some miscommunication at all don't take it seriously it's just a fun thing so there's another thing I need to ask you like your team is well prepared to the ten stack queries no I don't know about that I'm just learning the things no no security also anybody knows that right now yeah we received only last week only yeah and have you guys also received the versions of the country we are going to use put and technologies nineteen point two yeah and in the architecture they have mentioned two versions and yeah that's what about the standstack worry I have discussed with my team and two associates are ready with that they have implemented in the course itself they tried they tried and they have given the output and we are on like from tomorrow if we are moving to the official Github account we all need to make sure the official versons we are going to use the reactor typescript and everything so we need to research before that you can share the concepts what are the things we need to cover for the project we already told we speak something related to that no you are seeing the task that you are associated even not only tans that it covers all the concepts about it okay the end of today and we already share the knowledge about the team so you are new to so we thought you'll get some knowledge about handling the teams come again I mean me Google now jitsudi we already connected together I mean we had an understanding about our team also and how we're going to handle them we share insight about the teams handling regarding registration it has so many pills super advanced super doesn't need a physical going to have this session yeah she said she shared two registration forms for the superadmi actually regarding kind of registration approach for super admin and another space registration for that purpose with while you mixed that is the two way flow like platform at win and superadmin and another is the user sites the domain sites so we need to decide that with the Ux team for the register purpose and authorization as rudes and authorization it's for accepting the rules terms and conditions like the terms and conditions right we have to set a set column at the end of the registration yeah this project is based on RBS in self registration why it is required all our permission given from admin of superadmin sometimes an organization is coming outside the website they are need to register newly so they need the self registration process instead of contacting the admin and waiting for the time they can register themselves and get upload by the admin like that thing one see self registration for admin it will go as a notification after we've given a permission they can log in it same the process right exactly yeah exactly also for admins they can directly this particular modules can you are extended to go through that and okay can we wind up right now and after that you will host the project via the liquid all can connect our own files we have stand up here five hundred thirty can we all connecting before that appara will strengthen so so we need to be ready to ready with the links so before that is before we all need to be ready with Alex apart from the corrections we need to have the link with us so we can provide it with approval and we can to we are reviewing it right now actually you can share the new around for the new I need to deploy itself whether in my own account personal account website you can use the stack actually can stack immediately stokking for five thirty you want to connect together what about Shuti and Danesh we are done with the links and we can connect earlier the approval no bro we all have end of the call U is called S to the what was you calledit will be available around five thirty or small then we can connect all connect five thirty like we can find a coin now take your time and connect with thank you      sessionStorage.setItem(OTP_STORAGE_KEY, DUMMY_OTP)
  //     sessionStorage.setItem(OTP_STORAGE_KEY, DUMMY_OTP)
  //     setEmail(data.email)
  //     setOtpError(null)
  //     setShowOtp(true)
  //   } catch {
  //     // Error handled by API client interceptor
  //   } finally {
  //     setIsLoading(false)
  //   }

const handleSubmit = async (data: ForgotPasswordFormData) => {
  setIsLoading(true)
  try {
    await authService.forgotPassword(data)
    sessionStorage.setItem(OTP_STORAGE_KEY, DUMMY_OTP)
    setEmail(data.email)
    setOtpError(null)
    setShowOtp(true)
  } catch {
    // Error handled by API client interceptor
  } finally {
    setIsLoading(false)
  }
}

  const handleVerifyOtp = (data: OtpFormData) => {
    const savedOtp = sessionStorage.getItem(OTP_STORAGE_KEY)
    if (data.otp !== savedOtp) {
      setOtpError('Invalid OTP. Please enter the OTP sent to your email.')
      return
    }

    sessionStorage.removeItem(OTP_STORAGE_KEY)
    setOtpError(null)
    setIsSuccess(true)
  }

  const handleChangeEmail = () => {
    sessionStorage.removeItem(OTP_STORAGE_KEY)
    setShowOtp(false)
    setOtpError(null)
  }

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-brand-navy via-[#151a3d] to-brand-blue lg:flex">
        <div className="relative z-10 mt-auto p-12 pb-16">
          <h1 className="max-w-md text-4xl font-bold leading-tight text-white">
            Reset your password
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-blue-100">
            Enter your email and we&apos;ll send a secure link to restore access to{' '}
            {appConfig.name}.
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-brand-soft px-6 py-12 lg:w-1/2">
        {isSuccess ? (
          <div className="w-full max-w-md space-y-4 text-center">
            <img
              src="/stackly-logo.jpg"
              alt="Stackly"
              className="mx-auto mb-2 h-14 w-auto max-w-[200px] object-contain"
            />
            <h2 className="text-2xl font-bold text-brand-navy">Check your email</h2>
            <p className="text-muted-foreground">
              If an account exists, we&apos;ve sent a password reset link.
            </p>
            <Button asChild className="mt-2">
              <Link to={ROUTES.LOGIN}>Back to sign in</Link>
            </Button>
          </div>
        ) : showOtp ? (
          <OtpVerificationForm
            email={email}
            onSubmit={handleVerifyOtp}
            onBack={handleChangeEmail}
            error={otpError}
          />
        ) : (
          <ForgotPasswordForm onSubmit={handleSubmit} isLoading={isLoading} />
        )}
      </div>
    </div>
  )
}
