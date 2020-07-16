import Page from '@/components/Page/index';
import HeaderSimple from '@/components/HeaderSimple/index';
import Footer from '@/components/Footer/index';
import FormSuggestion from '@/components/FormSuggestion/index';
import MixinPage from '@/mixins/Page';

FormSuggestion.template = '#FormSuggestion';

export default {
  name: 'Suggestion',
  mixins: [MixinPage],
  components:{
    Page,
    HeaderSimple,
    Footer,
    FormSuggestion
  },
  data: function() {
    return {
      allowScrollNavigation: 0
    }
  }
}
