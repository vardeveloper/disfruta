import PageLogin from '@/components/PageLogin/index';
import HeaderSimple from '@/components/HeaderSimple/index';
import Footer from '@/components/Footer/index';
import FormLogin from '@/components/FormLogin/index';

FormLogin.template = '#FormLogin';

export default {
	name: 'Login',
	components:{
    PageLogin,
		HeaderSimple,
		FormLogin,
		Footer
	}
}
