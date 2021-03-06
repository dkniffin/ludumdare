import { h, Component } 				from 'preact/preact';
//import ShallowCompare	 				from 'shallow-compare/index';

import NavSpinner						from 'com/nav-spinner/spinner';
import NavLink 							from 'com/nav-link/link';
import SVGIcon 							from 'com/svg-icon/icon';

import ContentBody						from 'com/content-body/body';
import ContentBodyMarkup				from 'com/content-body-markup/body-markup';

import ContentFooterButtonLove			from 'com/content-footer-button-love/footer-button-love';

import $Node							from '../../shrub/js/node/node';

export default class ContentPost extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'author': {}
		};

		this.getAuthor( props.node );

		this.onMinMax = this.onMinMax.bind(this);
	}

//	shouldComponentUpdate( nextProps, nextState ) {
//		var com = ShallowCompare(this, nextProps, nextState);
////		console.log("HOOP",com,this.props, nextProps);
////		console.log("HOOP",com,this.state, nextState);
//		return com;
//	}

//	componentWillReceiveProps( props ) {
	componentWillUpdate( newProps, newState ) {
		if ( this.props.node !== newProps.node ) {
			this.getAuthor(newProps.node);
		}
	}

	getAuthor( node ) {
		// Clear the Author (QUESTION: why?)
		this.setState({ author: {} });

		// Lookup the author
		$Node.Get( node.author )
		.then(r => {
			if ( r.node && r.node.length ) {
				this.setState({ 'author': r.node[0] });
			}
			else {
				this.setState({ 'error': "Not found" });
			}
		})
		.catch(err => {
			this.setState({ 'error': err });
		});
	}

	getAvatar( user ) {
		return '//'+STATIC_DOMAIN + ((user && user.meta && user.meta.avatar) ? user.meta.avatar : '/other/dummy/user64.png');
	}

	getAtName( user ) {
		var user_path = '/users/'+user.slug;
		return <NavLink class="at-name" href={user_path}><img src={this.getAvatar(user)} />{user.name}</NavLink>;
	}

	onMinMax( e ) {
		console.log("minmax");
		window.location.hash = "#dummy";
	}

	render( {node, user, path, extra}, {author, error} ) {
		var EditMode = extra.length ? extra[0] === 'edit' : false;
		
		if ( node.slug && author.slug ) {
			var dangerousParsedTitle = { __html:titleParser.parse(node.name) };

			var date_pub = new Date(node.published);
			var date_now = new Date();
			var pub_diff = date_now.getTime() - date_pub.getTime();

			// x minutes ago
			var post_relative = <span class="if-sidebar-inline">{getRoughAge(pub_diff)}</span>;
			// simple date, full date on hover
			var post_date = <span>on <span class="-title" title={getLocaleDate(date_pub)}><span class="if-sidebar-inline">{getLocaleDay(date_pub)}</span> {getLocaleMonthDay(date_pub)}</span></span>;

			var post_by = <span>by {this.getAtName(author)}</span>;
			if ( author.meta['real-name'] ) {
				post_by = <span>by {author.meta['real-name']} ({this.getAtName(author)})</span>;
			}

			var post_avatar = this.getAvatar( author );

			return (
				<div class="content-base content-common content-post">
					<div class="content-header content-header-common -header">
						<div class="-avatar" onclick={e => { location.href = "#user-card/"+author.slug; }}>
							<img src={post_avatar} /><SVGIcon class="-info">info</SVGIcon>
						</div>
						<div class="-title _font2">
							<NavLink href={path} dangerouslySetInnerHTML={dangerousParsedTitle} />
						</div>
						<div class="-subtext">
							Posted {post_relative} {post_by} {post_date}
						</div>
					</div>
					<ContentBodyMarkup class="fudge">{node.body}</ContentBodyMarkup>
					<div class="content-footer content-footer-common -footer">
						<div class="-left">
							<div class="-minmax _hidden" onclick={this.onMinMax}>
								<SVGIcon>arrow-up</SVGIcon>
							</div>
						</div>
						<div class="-right">
				  			<ContentFooterButtonLove user={user} node={node} wedge_left_bottom />
				  		</div>
					</div>
				</div>
			);
		}
		else {
			return (
				<div class="content-base content-common content-post">
					<ContentBody>
						{ error ? error : <NavSpinner /> }
					</ContentBody>
				</div>
			);
		}
	}
}
