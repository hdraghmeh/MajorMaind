--
-- PostgreSQL database dump
--

\restrict B6uHvszpzgFls7nhu0fgcCqZBRcb87ZCwgdbXNibAmQgtYiaJAs2R06mgoNtsUL

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: completed_interviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.completed_interviews (
    id character varying NOT NULL,
    saved_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id character varying NOT NULL,
    user_email character varying,
    user_first_name character varying,
    user_last_name character varying,
    recommended_major character varying NOT NULL,
    match_score integer NOT NULL,
    total_messages integer NOT NULL,
    record jsonb NOT NULL,
    student_interests text
);


ALTER TABLE public.completed_interviews OWNER TO postgres;

--
-- Name: interview_feedback; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.interview_feedback (
    id character varying(36) NOT NULL,
    session_id character varying(36),
    user_id character varying NOT NULL,
    rating integer NOT NULL,
    comment text,
    submitted_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.interview_feedback OWNER TO postgres;

--
-- Name: interview_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.interview_sessions (
    id character varying NOT NULL,
    user_id character varying NOT NULL,
    data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.interview_sessions OWNER TO postgres;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess jsonb NOT NULL,
    expire timestamp without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    email character varying,
    first_name character varying,
    last_name character varying,
    profile_image_url character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: completed_interviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.completed_interviews (id, saved_at, user_id, user_email, user_first_name, user_last_name, recommended_major, match_score, total_messages, record, student_interests) FROM stdin;
949570aebfc4a33e	2026-05-11 11:54:27.193293+00	56412479	hamadaragmeh04@gmail.com	Hama	Daraghmeh	Medical Imaging	86	7	{"user": {"id": "56412479", "email": "hamadaragmeh04@gmail.com", "lastName": "Daraghmeh", "firstName": "Hama"}, "savedAt": "2026-05-11T11:54:27.183Z", "recordId": "949570aebfc4a33e", "sessionId": "c55b4f6c-d034-4384-aed5-ccdda907aa81", "totalMessages": 7, "recommendation": {"whyItFits": ["قلتِ إن الفيزياء أقوى مادة لديك وتحبين التجارب، وتخصص التصوير الطبي يعتمد على فيزياء الأشعة وتطبيقاتها العملية.", "ذكرتِ أنك تميلين لتحليل النتائج أكثر من تشغيل المعدات فقط، والتصوير الطبي يجمع بين تشغيل الأجهزة وتحليل الصور واتخاذ قرارات مبنية على بيانات.", "أسلوبك العملي وروح العمل ضمن فريق ينسجمان مع بيئة أقسام الأشعة في المستشفيات التي تتطلب تعاوناً مستمراً.", "لديك اهتمام بالتقنية والبرمجة، وهذا يفيدك في التعامل مع أنظمة PACS وDICOM وبرمجيات المعالجة، ما يضيف قيمة لعملك.", "طموحك للعمل في القطاع الحكومي يتوافق مع فرص مستشفيات وزارة الصحة والمراكز الحكومية التي توظّف مختصي التصوير الطبي باستمرار."], "matchScore": 86, "careerAdvice": ["اعملي زيارة أو يوم مرافقة لقسم الأشعة في مستشفى حكومي قريب للتعرّف على طبيعة العمل والأجهزة وسير الفريق.", "ابدئي بتقوية أساسيات التشريح والفيزياء الطبية، وتعلمي مبادئ السلامة الإشعاعية مبكراً (Radiation Safety).", "طوري مهارات تحليل البيانات عبر أدوات مثل Excel وPython أساسياتياً لتفوق إضافي في قراءة التقارير والاتجاهات.", "ابحثي عن تدريب صيفي أو نشاط تطوعي في مستشفى أو مركز تصوير لتعزيز الخبرة العملية والشبكات المهنية.", "كوّني ملف مهارات رقمي يشمل دورات قصيرة في PACS/DICOM والتواصل مع المرضى، فهذا يعزز فرص التوظيف في القطاع العام."], "admissionNote": "معدلك 80% يستوفي الحد الأدنى لفرع Scientific البالغ 70% لهذا التخصص في AAUP.", "closingMessage": "متحمسة لكِ يا هامة، لديكِ مزيج جميل بين الفيزياء والتحليل والعمل ضمن فريق. خطوة ثابتة اليوم ستقربك من مقعدك في قسم الأشعة غداً—وأنا هنا لأي استفسار.", "recommendedMajor": "Medical Imaging", "studentInterests": ["التكنولوجيا", "التحليل", "الفيزياء التطبيقية", "القطاع الصحي", "العمل الجماعي"], "academicStrengths": ["قوة في الفيزياء مع ميل للتطبيق العملي.", "قدرة واضحة على التحليل واستخلاص النتائج من البيانات.", "إتقان جيد للإنجليزي يساعد في فهم المصطلحات الطبية والبرمجيات.", "تفضيل العمل ضمن فريق يسهّل الاندماج في بيئة المستشفيات."], "alternativeMajors": ["Data Science - Statistics", "AI and Health Sciences", "GIS"]}, "studentAnswers": [{"answer": "فيزيا", "question": "أهلاً هامة فواز دراغمة من طوباس! حلو إنك بتحبي التعلم العملي وميولك للتكنولوجيا واضحة. من بين الإنجليزي والأحياء والفيزياء والرياضيات، أي مادة بتحسيها أقوى نقطة عندك حالياً؟"}, {"answer": "تجارب", "question": "جميل، واضح إن الفيزياء نقطة قوة عندك. أي جزء بتحبيه أكثر: الميكانيكا، ولا الكهرباء والمغناطيسية، ولا التجارب العملية؟ وليش؟"}, {"answer": "تحليل", "question": "حلو، التجارب بتناسب أسلوبك العملي. بتحبي أكتر التعامل مع الأجهزة والقياسات والمعدّات (زي دوائر وكهرباء أو أجهزة تصوير)، ولا تحليل النتائج والبرمجة على الكمبيوتر؟"}], "fullConversation": [{"role": "advisor", "content": "أهلاً هامة فواز دراغمة من طوباس! حلو إنك بتحبي التعلم العملي وميولك للتكنولوجيا واضحة. من بين الإنجليزي والأحياء والفيزياء والرياضيات، أي مادة بتحسيها أقوى نقطة عندك حالياً؟"}, {"role": "student", "content": "فيزيا"}, {"role": "advisor", "content": "جميل، واضح إن الفيزياء نقطة قوة عندك. أي جزء بتحبيه أكثر: الميكانيكا، ولا الكهرباء والمغناطيسية، ولا التجارب العملية؟ وليش؟"}, {"role": "student", "content": "تجارب"}, {"role": "advisor", "content": "حلو، التجارب بتناسب أسلوبك العملي. بتحبي أكتر التعامل مع الأجهزة والقياسات والمعدّات (زي دوائر وكهرباء أو أجهزة تصوير)، ولا تحليل النتائج والبرمجة على الكمبيوتر؟"}, {"role": "student", "content": "تحليل"}, {"role": "advisor", "content": "تمام، ميولك للتحليل واضحة. لما تحلّلي البيانات، بتحبي أكتر الأرقام والجداول والرسوم البيانية، ولا الصور والخرائط والقياسات المكانية؟"}]}	التكنولوجيا, التحليل, الفيزياء التطبيقية, القطاع الصحي, العمل الجماعي
4ab5f7373f90e7ff	2026-05-11 11:55:05.940343+00	56412479	hamadaragmeh04@gmail.com	Hama	Daraghmeh	Medical Imaging	84	7	{"user": {"id": "56412479", "email": "hamadaragmeh04@gmail.com", "lastName": "Daraghmeh", "firstName": "Hama"}, "savedAt": "2026-05-11T11:55:05.930Z", "recordId": "4ab5f7373f90e7ff", "sessionId": "c55b4f6c-d034-4384-aed5-ccdda907aa81", "totalMessages": 7, "recommendation": {"whyItFits": ["قوتك في الفيزياء وحبّك للتجارب العملية ينسجمان مع أساسيات التصوير الطبي المعتمدة على مبادئ فيزيائية (أشعة، موجات، رنين).", "تفضيلك للتحليل والملاحظة يناسب قراءة الصور وضبط جودة الفحوصات والتعامل مع البيانات الناتجة.", "أسلوبك العملي ورغبتك بالعمل ضمن فريق يتوافقان مع بيئة أقسام الأشعة في المستشفيات.", "طموحك للعمل في القطاع الحكومي ينسجم مع وجود فرص في مستشفيات وزارة الصحة ومراكز الأشعة العامة.", "ابتعادك عن الكيمياء والبرمجة الثقيلة يجعل التصوير الطبي خياراً متوازناً بين التقنية والتطبيق العملي."], "matchScore": 84, "careerAdvice": ["اعملي يوم تظليل/زيارة لقسم الأشعة في مستشفى طوباس أو نابلس لتتعرّفي على طبيعة العمل الفعلي.", "خذي مساقاً تمهيدياً في Medical Physics أو Anatomy for Imaging مبكراً لبناء قاعدة قوية.", "طوّري مهارات التحليل بالأدوات العملية مثل Excel والأساسيات في Python عند الحاجة لتحليل بيانات/صور.", "حسّني المصطلحات الطبية بالإنجليزية عبر مصادر مثل Radiopaedia ودورات قصيرة.", "تواصلي مع خريجين يعملون في أقسام الأشعة الحكومية واسألي عن متطلبات ديوان الموظفين والاختبارات للتعيين."], "admissionNote": "معدلك 80% يستوفي الحد الأدنى لفرع Scientific البالغ 70% لهذا التخصص في AAUP.", "closingMessage": "متحمّس لك يا هامة—اختيارك يمزج بين الفيزياء والتطبيق العملي وفرص حقيقية في القطاع العام. أنا هنا لأي سؤال أو مقارنة إضافية بين الخيارات.", "recommendedMajor": "Medical Imaging", "studentInterests": ["الفيزياء", "التحليل", "التجارب العملية", "التقنية والبرمجة", "القطاع الحكومي", "العمل ضمن فريق"], "academicStrengths": ["أساس جيد في الفيزياء والرياضيات يدعم الفهم التقني.", "ميل واضح للتحليل وقراءة النتائج.", "تعلم عملي وتجارب يقوّي الجانب التطبيقي.", "ارتياح للعمل ضمن فريق في بيئات خدماتية."], "alternativeMajors": ["Data Science - Statistics", "AI and Health Sciences", "Electrical Engineering and Renewable Energy"]}, "studentAnswers": [{"answer": "فيزيا", "question": "أهلاً هامة فواز دراغمة من طوباس! حلو إنك بتحبي التعلم العملي وميولك للتكنولوجيا واضحة. من بين الإنجليزي والأحياء والفيزياء والرياضيات، أي مادة بتحسيها أقوى نقطة عندك حالياً؟"}, {"answer": "تجارب", "question": "جميل، واضح إن الفيزياء نقطة قوة عندك. أي جزء بتحبيه أكثر: الميكانيكا، ولا الكهرباء والمغناطيسية، ولا التجارب العملية؟ وليش؟"}, {"answer": "تحليل", "question": "حلو، التجارب بتناسب أسلوبك العملي. بتحبي أكتر التعامل مع الأجهزة والقياسات والمعدّات (زي دوائر وكهرباء أو أجهزة تصوير)، ولا تحليل النتائج والبرمجة على الكمبيوتر؟"}], "fullConversation": [{"role": "advisor", "content": "أهلاً هامة فواز دراغمة من طوباس! حلو إنك بتحبي التعلم العملي وميولك للتكنولوجيا واضحة. من بين الإنجليزي والأحياء والفيزياء والرياضيات، أي مادة بتحسيها أقوى نقطة عندك حالياً؟"}, {"role": "student", "content": "فيزيا"}, {"role": "advisor", "content": "جميل، واضح إن الفيزياء نقطة قوة عندك. أي جزء بتحبيه أكثر: الميكانيكا، ولا الكهرباء والمغناطيسية، ولا التجارب العملية؟ وليش؟"}, {"role": "student", "content": "تجارب"}, {"role": "advisor", "content": "حلو، التجارب بتناسب أسلوبك العملي. بتحبي أكتر التعامل مع الأجهزة والقياسات والمعدّات (زي دوائر وكهرباء أو أجهزة تصوير)، ولا تحليل النتائج والبرمجة على الكمبيوتر؟"}, {"role": "student", "content": "تحليل"}, {"role": "advisor", "content": "تمام، ميولك للتحليل واضحة. لما تحلّلي البيانات، بتحبي أكتر الأرقام والجداول والرسوم البيانية، ولا الصور والخرائط والقياسات المكانية؟"}]}	الفيزياء, التحليل, التجارب العملية, التقنية والبرمجة, القطاع الحكومي, العمل ضمن فريق
5676dd0e174f72fa	2026-05-11 21:04:38.859241+00	56412479	hamadaragmeh04@gmail.com	Hama	Daraghmeh	Operations Management - Hospitals	86	3	{"user": {"id": "56412479", "email": "hamadaragmeh04@gmail.com", "lastName": "Daraghmeh", "firstName": "Hama"}, "savedAt": "2026-05-11T21:04:38.850Z", "recordId": "5676dd0e174f72fa", "sessionId": "f0444148-9aac-466a-9c6e-97f49871826b", "totalMessages": 3, "recommendation": {"whyItFits": ["ذكرتِ أن العمل الحكومي مع جانب الإدارة يجذبك، وإدارة العمليات في المستشفيات مسار مباشر نحو وظائف في وزارة الصحة والمستشفيات الحكومية.", "تفضيلك للبيولوجيا والمواد العلمية يلائم بيئة الرعاية الصحية، مع تركيز إداري تطبيقي بعيد عن الكيمياء التي لا تفضلينها.", "أسلوبك العملي وحبك للعمل ضمن فريق ينسجمان مع طبيعة التشغيل اليومي والتنسيق متعدد التخصصات داخل المستشفيات.", "اهتمامك بالتقنية يمكن توظيفه في أنظمة معلومات المستشفيات والتحول الرقمي وإدارة البيانات دون الحاجة للغوص في برمجة خالصة (خصوصاً مع عدم تفضيلك لمادة الحاسوب بالمدرسة).", "قلقك من الفرص يعالجه هذا المسار لأن الطلب على تحسين الكفاءة والجودة في القطاع الصحي العام ثابت وذو مسارات ترقية واضحة."], "matchScore": 86, "careerAdvice": ["خذي مساقات مبكرة في إدارة العمليات، إدارة المستشفيات، وسلامة وجودة الرعاية (مثل Lean وSix Sigma Healthcare).", "طوري أدوات عملية: Excel متقدم، أساسيات SQL، ومفاهيم أنظمة معلومات المستشفيات (HIS) وإدارة البيانات.", "ابحثي عن تدريب أو تطوع في مستشفى حكومي/مديرية صحة لمشاريع تحسين تدفق المرضى أو تقليل أوقات الانتظار.", "أنجزي مشروعاً عملياً صغيراً (Case Study) توثّقين فيه تحليلاً لعملية سريرية/إدارية مع مقاييس قبل وبعد.", "تابعي إعلانات ديوان الموظفين ووزارة الصحة، وجهّزي سيرة ذاتية تركّز على الإدارة التشغيلية والتحول الرقمي في القطاع الصحي."], "admissionNote": "معدلك 80% يستوفي الحد الأدنى لفرع Scientific البالغ 65% لهذا التخصص في AAUP.", "closingMessage": "متفائلة بمسارك يا هامة—اختيار يوازن بين شغفك بالإدارة والبيئة الصحية وطموحك للقطاع الحكومي. أنا هنا لأي أسئلة تالية عن الخطة الدراسية أو الفرص العملية.", "recommendedMajor": "Operations Management - Hospitals", "studentInterests": ["الإدارة", "القطاع الحكومي", "التقنية", "الصحة", "العمل الجماعي", "البرمجة"], "academicStrengths": ["ميل قوي للمواد العلمية وخاصة البيولوجيا والفيزياء والرياضيات", "أسلوب تعلم عملي يترجم بسرعة إلى تطبيقات ميدانية", "شخصية إبداعية وتفضيل للعمل ضمن فريق", "إجادة الإنجليزية تدعمك في مصادر الإدارة والجودة الصحية"], "alternativeMajors": ["Operations Management - MIS", "AI and Health Sciences", "Data Science - Statistics", "Technology and Society - Sustainable Development"]}, "studentAnswers": [{"answer": "الإدارة", "question": "أهلاً يا هامة فواز دراغمة، لفتني طموحك للعمل في القطاع الحكومي وقلقك من قلّة الفرص في مجال التقنية. ما أكثر ما يجذبك في القطاع الحكومي؟"}], "fullConversation": [{"role": "advisor", "content": "أهلاً يا هامة فواز دراغمة، لفتني طموحك للعمل في القطاع الحكومي وقلقك من قلّة الفرص في مجال التقنية. ما أكثر ما يجذبك في القطاع الحكومي؟"}, {"role": "student", "content": "الإدارة"}, {"role": "advisor", "content": "حلو، واضح إن جانب الإدارة يشدّك. بتتخيلي نفسك أكثر في إدارة مشاريع تقنية (أنظمة معلومات، تحوّل رقمي) أم إدارة مؤسسات خدمية حكومية مثل البلديات أو المستشفيات؟"}]}	الإدارة, القطاع الحكومي, التقنية, الصحة, العمل الجماعي, البرمجة
\.


--
-- Data for Name: interview_feedback; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.interview_feedback (id, session_id, user_id, rating, comment, submitted_at) FROM stdin;
\.


--
-- Data for Name: interview_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.interview_sessions (id, user_id, data, created_at, updated_at) FROM stdin;
c55b4f6c-d034-4384-aed5-ccdda907aa81	56412479	{"id": "c55b4f6c-d034-4384-aed5-ccdda907aa81", "title": "Medical Imaging", "messages": [{"role": "advisor", "content": "أهلاً هامة فواز دراغمة من طوباس! حلو إنك بتحبي التعلم العملي وميولك للتكنولوجيا واضحة. من بين الإنجليزي والأحياء والفيزياء والرياضيات، أي مادة بتحسيها أقوى نقطة عندك حالياً؟"}, {"role": "student", "content": "فيزيا"}, {"role": "advisor", "content": "جميل، واضح إن الفيزياء نقطة قوة عندك. أي جزء بتحبيه أكثر: الميكانيكا، ولا الكهرباء والمغناطيسية، ولا التجارب العملية؟ وليش؟"}, {"role": "student", "content": "تجارب"}, {"role": "advisor", "content": "حلو، التجارب بتناسب أسلوبك العملي. بتحبي أكتر التعامل مع الأجهزة والقياسات والمعدّات (زي دوائر وكهرباء أو أجهزة تصوير)، ولا تحليل النتائج والبرمجة على الكمبيوتر؟"}, {"role": "student", "content": "تحليل"}, {"role": "advisor", "content": "تمام، ميولك للتحليل واضحة. لما تحلّلي البيانات، بتحبي أكتر الأرقام والجداول والرسوم البيانية، ولا الصور والخرائط والقياسات المكانية؟"}], "progress": {"stage": "التوصية النهائية", "percent": 100}, "createdAt": "2026-05-11T11:50:56.241Z", "updatedAt": "2026-05-11T11:55:06.305Z", "recommendation": {"whyItFits": ["قوتك في الفيزياء وحبّك للتجارب العملية ينسجمان مع أساسيات التصوير الطبي المعتمدة على مبادئ فيزيائية (أشعة، موجات، رنين).", "تفضيلك للتحليل والملاحظة يناسب قراءة الصور وضبط جودة الفحوصات والتعامل مع البيانات الناتجة.", "أسلوبك العملي ورغبتك بالعمل ضمن فريق يتوافقان مع بيئة أقسام الأشعة في المستشفيات.", "طموحك للعمل في القطاع الحكومي ينسجم مع وجود فرص في مستشفيات وزارة الصحة ومراكز الأشعة العامة.", "ابتعادك عن الكيمياء والبرمجة الثقيلة يجعل التصوير الطبي خياراً متوازناً بين التقنية والتطبيق العملي."], "matchScore": 84, "careerAdvice": ["اعملي يوم تظليل/زيارة لقسم الأشعة في مستشفى طوباس أو نابلس لتتعرّفي على طبيعة العمل الفعلي.", "خذي مساقاً تمهيدياً في Medical Physics أو Anatomy for Imaging مبكراً لبناء قاعدة قوية.", "طوّري مهارات التحليل بالأدوات العملية مثل Excel والأساسيات في Python عند الحاجة لتحليل بيانات/صور.", "حسّني المصطلحات الطبية بالإنجليزية عبر مصادر مثل Radiopaedia ودورات قصيرة.", "تواصلي مع خريجين يعملون في أقسام الأشعة الحكومية واسألي عن متطلبات ديوان الموظفين والاختبارات للتعيين."], "admissionNote": "معدلك 80% يستوفي الحد الأدنى لفرع Scientific البالغ 70% لهذا التخصص في AAUP.", "closingMessage": "متحمّس لك يا هامة—اختيارك يمزج بين الفيزياء والتطبيق العملي وفرص حقيقية في القطاع العام. أنا هنا لأي سؤال أو مقارنة إضافية بين الخيارات.", "recommendedMajor": "Medical Imaging", "academicStrengths": ["أساس جيد في الفيزياء والرياضيات يدعم الفهم التقني.", "ميل واضح للتحليل وقراءة النتائج.", "تعلم عملي وتجارب يقوّي الجانب التطبيقي.", "ارتياح للعمل ضمن فريق في بيئات خدماتية."], "alternativeMajors": ["Data Science - Statistics", "AI and Health Sciences", "Electrical Engineering and Renewable Energy"]}}	2026-05-11 11:50:56.340836+00	2026-05-11 11:55:06.305+00
42800253-75f1-4c8d-b984-f1f8ff6952b0	56412479	{"id": "42800253-75f1-4c8d-b984-f1f8ff6952b0", "messages": [], "createdAt": "2026-05-11T11:55:27.519Z", "updatedAt": "2026-05-11T11:55:27.587Z"}	2026-05-11 11:55:27.587592+00	2026-05-11 11:55:27.587592+00
dc3c489f-18e8-40d1-b96a-54e5af1bfa84	56412479	{"id": "dc3c489f-18e8-40d1-b96a-54e5af1bfa84", "messages": [{"role": "advisor", "content": "أهلاً هامة فواز دراغمة! لفتني حبك للتقنية والبرمجة. في هذا المجال، ما الشيء الذي يحمّسك أكثر لتتعلّميه أو تبنيه؟"}, {"role": "student", "content": "بناء التطبيقات مُستقبلاً بعد الإنتهاء من مرحلة التوجيهي"}, {"role": "advisor", "content": "جميل جداً، هدف واضح وحماسي. بتتخيّلي أول تطبيق بتحبيه يركّز على أي مجال أكثر: صحي، تعليمي، ولا خدمات حكومية للمجتمع؟"}], "progress": {"stage": "الاهتمامات المهنية", "percent": 20}, "createdAt": "2026-05-11T14:41:15.482Z", "updatedAt": "2026-05-11T14:42:21.783Z"}	2026-05-11 14:41:15.418583+00	2026-05-11 14:42:21.783+00
f0444148-9aac-466a-9c6e-97f49871826b	56412479	{"id": "f0444148-9aac-466a-9c6e-97f49871826b", "title": "Operations Management - Hospitals", "messages": [{"role": "advisor", "content": "أهلاً يا هامة فواز دراغمة، لفتني طموحك للعمل في القطاع الحكومي وقلقك من قلّة الفرص في مجال التقنية. ما أكثر ما يجذبك في القطاع الحكومي؟"}, {"role": "student", "content": "الإدارة"}, {"role": "advisor", "content": "حلو، واضح إن جانب الإدارة يشدّك. بتتخيلي نفسك أكثر في إدارة مشاريع تقنية (أنظمة معلومات، تحوّل رقمي) أم إدارة مؤسسات خدمية حكومية مثل البلديات أو المستشفيات؟"}], "progress": {"stage": "التوصية النهائية", "percent": 100}, "createdAt": "2026-05-11T21:02:51.647Z", "updatedAt": "2026-05-11T21:04:39.218Z", "recommendation": {"whyItFits": ["ذكرتِ أن العمل الحكومي مع جانب الإدارة يجذبك، وإدارة العمليات في المستشفيات مسار مباشر نحو وظائف في وزارة الصحة والمستشفيات الحكومية.", "تفضيلك للبيولوجيا والمواد العلمية يلائم بيئة الرعاية الصحية، مع تركيز إداري تطبيقي بعيد عن الكيمياء التي لا تفضلينها.", "أسلوبك العملي وحبك للعمل ضمن فريق ينسجمان مع طبيعة التشغيل اليومي والتنسيق متعدد التخصصات داخل المستشفيات.", "اهتمامك بالتقنية يمكن توظيفه في أنظمة معلومات المستشفيات والتحول الرقمي وإدارة البيانات دون الحاجة للغوص في برمجة خالصة (خصوصاً مع عدم تفضيلك لمادة الحاسوب بالمدرسة).", "قلقك من الفرص يعالجه هذا المسار لأن الطلب على تحسين الكفاءة والجودة في القطاع الصحي العام ثابت وذو مسارات ترقية واضحة."], "matchScore": 86, "careerAdvice": ["خذي مساقات مبكرة في إدارة العمليات، إدارة المستشفيات، وسلامة وجودة الرعاية (مثل Lean وSix Sigma Healthcare).", "طوري أدوات عملية: Excel متقدم، أساسيات SQL، ومفاهيم أنظمة معلومات المستشفيات (HIS) وإدارة البيانات.", "ابحثي عن تدريب أو تطوع في مستشفى حكومي/مديرية صحة لمشاريع تحسين تدفق المرضى أو تقليل أوقات الانتظار.", "أنجزي مشروعاً عملياً صغيراً (Case Study) توثّقين فيه تحليلاً لعملية سريرية/إدارية مع مقاييس قبل وبعد.", "تابعي إعلانات ديوان الموظفين ووزارة الصحة، وجهّزي سيرة ذاتية تركّز على الإدارة التشغيلية والتحول الرقمي في القطاع الصحي."], "admissionNote": "معدلك 80% يستوفي الحد الأدنى لفرع Scientific البالغ 65% لهذا التخصص في AAUP.", "closingMessage": "متفائلة بمسارك يا هامة—اختيار يوازن بين شغفك بالإدارة والبيئة الصحية وطموحك للقطاع الحكومي. أنا هنا لأي أسئلة تالية عن الخطة الدراسية أو الفرص العملية.", "recommendedMajor": "Operations Management - Hospitals", "academicStrengths": ["ميل قوي للمواد العلمية وخاصة البيولوجيا والفيزياء والرياضيات", "أسلوب تعلم عملي يترجم بسرعة إلى تطبيقات ميدانية", "شخصية إبداعية وتفضيل للعمل ضمن فريق", "إجادة الإنجليزية تدعمك في مصادر الإدارة والجودة الصحية"], "alternativeMajors": ["Operations Management - MIS", "AI and Health Sciences", "Data Science - Statistics", "Technology and Society - Sustainable Development"]}}	2026-05-11 21:02:51.004253+00	2026-05-11 21:04:39.218+00
ca45d8ea-486f-418d-9dd9-1ce1763584f1	56412479	{"id": "ca45d8ea-486f-418d-9dd9-1ce1763584f1", "messages": [], "createdAt": "2026-05-10T22:45:07.945Z", "updatedAt": "2026-05-11T16:38:04.998Z", "profileData": {"age": "18", "city": "طوباس", "name": "هامة فواز دراغمة ", "hobbies": ["القراءة "], "concerns": "عدم وجود فرص عمل لمجال اهتمامي ", "aspirations": "أعمل في القطاع الحكومي أو العام", "completedAt": "2026-05-09T22:06:56.739Z", "personality": "creative", "learningStyle": "practical", "tawjihiStream": "scientific", "tawjihiAverage": "80", "workPreference": "team", "careerInterests": ["Technology & Programming"], "favoriteSubjects": ["English", "Biology", "Physics", "Mathematics"], "leastFavoriteSubjects": ["Chemistry", "Computer Science", "Economics"]}}	2026-05-11 16:37:55.648597+00	2026-05-11 16:38:04.998+00
61fb6373-170a-4dd0-bcd1-26d6de5034ac	56412479	{"id": "61fb6373-170a-4dd0-bcd1-26d6de5034ac", "messages": [{"role": "advisor", "content": "أهلاً هامة فواز دراغمة، لفتني اهتمامك بالتقنية والبرمجة مع طموحك للعمل في القطاع الحكومي. كيف بتتخيّلي دورك التقني داخل مؤسسة حكومية؟"}], "progress": {"stage": "الإحماء", "percent": 10}, "createdAt": "2026-05-11T17:08:01.648Z", "updatedAt": "2026-05-11T17:08:20.312Z"}	2026-05-11 17:08:01.313315+00	2026-05-11 17:08:20.312+00
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (sid, sess, expire) FROM stdin;
391718361670526d25cdeeab89723cf84523d75b16b8f66531aa863cdc86ce26	{"user": {"id": "56412479", "email": "hamadaragmeh04@gmail.com", "lastName": "Daraghmeh", "firstName": "Hama", "profileImageUrl": "https://lh3.googleusercontent.com/a/ACg8ocJKnswvtaBWtMpLSt2LzqhGHDczpUv03nP4yVUmT8vlA6K0_g=s96-c"}, "expires_at": 1778855930, "access_token": "tw-HMN_4yE2ejTp-akQg32IYot2ID34VNVCLgrc_fxg", "refresh_token": "92SZmTwCa-wXVOF5eh6XoVygQolj22l46siXzaCUPWu"}	2026-05-22 13:38:51.183
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, first_name, last_name, profile_image_url, created_at, updated_at) FROM stdin;
56412479	hamadaragmeh04@gmail.com	Hama	Daraghmeh	https://lh3.googleusercontent.com/a/ACg8ocJKnswvtaBWtMpLSt2LzqhGHDczpUv03nP4yVUmT8vlA6K0_g=s96-c	2026-05-11 11:50:41.398534+00	2026-05-11 21:02:24.205+00
\.


--
-- Name: completed_interviews completed_interviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.completed_interviews
    ADD CONSTRAINT completed_interviews_pkey PRIMARY KEY (id);


--
-- Name: interview_feedback interview_feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interview_feedback
    ADD CONSTRAINT interview_feedback_pkey PRIMARY KEY (id);


--
-- Name: interview_sessions interview_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interview_sessions
    ADD CONSTRAINT interview_sessions_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_session_expire" ON public.sessions USING btree (expire);


--
-- Name: completed_interviews completed_interviews_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.completed_interviews
    ADD CONSTRAINT completed_interviews_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: interview_feedback interview_feedback_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interview_feedback
    ADD CONSTRAINT interview_feedback_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: interview_sessions interview_sessions_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interview_sessions
    ADD CONSTRAINT interview_sessions_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict B6uHvszpzgFls7nhu0fgcCqZBRcb87ZCwgdbXNibAmQgtYiaJAs2R06mgoNtsUL

