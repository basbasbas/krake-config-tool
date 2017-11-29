<?php
/**
 * Plugin Name: Test plugin
 * Description: Testing some plugin options.
 * Version: 0.1
 * Author: Sebastiaan Bosch
 * Author URI: fourfive.nl
 * License: MIT
 */




/**
 * custom option and settings
 */
function wporg_settings_init() {
    // register a new setting for "wporg" page
    register_setting( 'wporg', 'wporg_options' );

    // register a new section in the "wporg" page
    add_settings_section(
        'wporg_section_developers',
        __( 'Config', 'wporg' ),
        'wporg_section_developers_cb',
        'wporg'
    );

    // TODO: combine these
    add_settings_field(
        'wporg_field_pill',
        __( 'Page config', 'wporg' ),
        'wporg_field_pill_cb',
        'wporg',
        'wporg_section_developers',
        [
            'label_for' => 'wporg_field_pill',
            'class' => 'wporg_row',
            'wporg_custom_data' => 'custom',
        ]
    );
    add_settings_field(
        'wporg_field_pill2',
        __( 'Data config', 'wporg' ),
        'wporg_field_pill2_cb',
        'wporg',
        'wporg_section_developers',
        [
            'label_for' => 'wporg_field_pill2',
            'class' => 'wporg_row',
            'wporg_custom_data' => 'custom',
        ]
    );
    add_settings_field(
        'wporg_field_pill3',
        __( 'Menu config', 'wporg' ),
        'wporg_field_pill3_cb',
        'wporg',
        'wporg_section_developers',
        [
            'label_for' => 'wporg_field_pill3',
            'class' => 'wporg_row',
            'wporg_custom_data' => 'custom',
        ]
    );
}

/**
 * register to admin_init hook
 */
add_action( 'admin_init', 'wporg_settings_init' );

/**
 * custom option and settings:
 * callback functions
 */

// Admin list text
function wporg_section_developers_cb( $args ) {
    ?>
	<p id="<?php echo esc_attr( $args['id'] ); ?>"><?php esc_html_e( 'Website Configuration', 'wporg' ); ?></p>
    <?php
}

// pill field cb

// field callbacks can accept an $args parameter, which is an array.
// $args is defined at the add_settings_field() function.
// wordpress has magic interaction with the following keys: label_for, class.
// the "label_for" key value is used for the "for" attribute of the <label>.
// the "class" key value is used for the "class" attribute of the <tr> containing the field.
// you can add custom key value pairs to be used inside your callbacks.


// TODO; combine these
// TODO; improve layout, possibly use nested dropdowns
function wporg_field_pill_cb( $args ) {
    // get the value of the setting we've registered with register_setting()
    $options = get_option( 'wporg_options' );

    // Default config value
    $config_json = file_get_contents(plugin_dir_path( __FILE__ ) . 'default-page-config.json');

    // output the field
    ?>
   <pre><textarea id="<?php echo esc_attr( $args['label_for'] ); ?>"
       data-custom="<?php echo esc_attr( $args['wporg_custom_data'] ); ?>"
       name="wporg_options[<?php echo esc_attr( $args['label_for'] ); ?>]"
		 rows="40" cols="70"><?php echo empty( $options[ $args['label_for'] ] )
			  ? $config_json
			  : $options[ $args['label_for'] ]?></textarea></pre>


    <?php
}
function wporg_field_pill2_cb( $args ) {

    $options = get_option( 'wporg_options' );
    $config_json = file_get_contents(plugin_dir_path( __FILE__ ) . 'default-website-config.json');

    ?>
	<pre><textarea id="<?php echo esc_attr( $args['label_for'] ); ?>"
						data-custom="<?php echo esc_attr( $args['wporg_custom_data'] ); ?>"
						name="wporg_options[<?php echo esc_attr( $args['label_for'] ); ?>]"
						rows="40" cols="70"><?php echo empty( $options[ $args['label_for'] ] )
               ? $config_json
               : $options[ $args['label_for'] ]?></textarea></pre>

    <?php
}
function wporg_field_pill3_cb( $args ) {

    $options = get_option( 'wporg_options' );
    $config_json = file_get_contents(plugin_dir_path( __FILE__ ) . 'default-menu-config.json');

    ?>
	<pre><textarea id="<?php echo esc_attr( $args['label_for'] ); ?>"
						data-custom="<?php echo esc_attr( $args['wporg_custom_data'] ); ?>"
						name="wporg_options[<?php echo esc_attr( $args['label_for'] ); ?>]"
						rows="40" cols="70"><?php echo empty( $options[ $args['label_for'] ] )
               ? $config_json
               : $options[ $args['label_for'] ]?></textarea></pre>

    <?php
}

// TODO: combine
function get_page_config() {
    $options = get_option( 'wporg_options' );

    if ( empty( $options['wporg_field_pill'] ) ) {
        return null;
    }

    return  json_decode($options['wporg_field_pill']);
}
function get_data_config() {
    $options = get_option( 'wporg_options' );

    if ( empty( $options['wporg_field_pill2'] ) ) {
        return null;
    }

    return  json_decode($options['wporg_field_pill2']);
}
function get_menu_config() {
    $options = get_option( 'wporg_options' );

    if ( empty( $options['wporg_field_pill3'] ) ) {
        return null;
    }

    return  json_decode($options['wporg_field_pill3']);
}

// TODO: combine; use object
add_action( 'rest_api_init', function () {
    register_rest_route('test-plugin', '/website-page-config', array(
        'methods' => 'GET',
        'callback' => 'get_page_config',
    ));
    register_rest_route('test-plugin', '/website-data-config', array(
        'methods' => 'GET',
        'callback' => 'get_data_config',
    ));
    register_rest_route('test-plugin', '/website-menu-config', array(
        'methods' => 'GET',
        'callback' => 'get_menu_config',
    ));
});

/**
 * top level menu
 */
function wporg_options_page() {
    // add top level menu page
    add_menu_page(
        'Website Configuratie',
        'Website Configuratie',
        'manage_options',
        'wporg',
        'wporg_options_page_html'
    );
}

/**
 * register our wporg_options_page to the admin_menu action hook
 */
add_action( 'admin_menu', 'wporg_options_page' );

/**
 * top level menu:
 * callback functions
 */
function wporg_options_page_html()
{
// check user capabilities
    if (!current_user_can('manage_options')) {
        return;
    }

// add error/update messages

// check if the user have submitted the settings
// wordpress will add the "settings-updated" $_GET parameter to the url
    if (isset($_GET['settings-updated'])) {
        // add settings saved message with the class of "updated"
        add_settings_error('wporg_messages', 'wporg_message', __('Settings Saved', 'wporg'), 'updated');
    }

// show error/update messages
    settings_errors('wporg_messages');
    ?>
	<div class="wrap">
		<h1><?php echo esc_html(get_admin_page_title()); ?></h1>
		<form action="options.php" method="post">
          <?php
          // output security fields for the registered setting "wporg"
          settings_fields('wporg');
          // output setting sections and their fields
          // (sections are registered for "wporg", each field is registered to a specific section)
          do_settings_sections('wporg');
          // output save settings button
          submit_button('Save Settings');
          ?>
		</form>
	</div>
    <?php
}

