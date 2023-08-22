## SimGraphVisualizer User Guide

### Introduction
SimGraphVisualizer stands as a cutting-edge JavaScript library specifically designed for visualizing and editing Ising graphs. Developed with the JavaScript programming language at its core, this library operates seamlessly in web browsers. Thus, users won't have the hassle of managing bulky server requirements to achieve smooth visualizations.

For those desiring a more immersive experience, SimGraphVisualizer is versatile. It can be effortlessly compiled into a full-fledged desktop application. This is achieved by leveraging the ElectronJS library in conjunction with the power of the Chromium engine.

### License Information
All rights pertaining to SimGraphVisualizer are reserved by its creator, Dariusz Pojda. He can be reached at dpojda@iitis.pl for any queries or clarifications. It's important to note that SimGraphVisualizer is licensed under the widely recognized Apache License 2.0, ensuring flexibility and adaptability for its users.

### Download and Installation Guide

1. **Cloning the Repository**:
    Start by copying the SimGraphVisualizer repository to your local system using:
    ```
    git clone https://github.com/euro-hpc-pl/simGraphVisualizer.git
    ```

   Once cloned, navigate to the repository's directory:
   ```
   cd simGraphVisualizer
   ```

2. **Using SimGraphVisualizer in a Web Browser**:
    For those who prefer a straightforward web browser experience, there's no additional setup needed. The 'public_html' folder within the repository is your gateway to this. Files within this directory are precompiled and primed for immediate use.

    To initiate, just move or copy the entire contents of the 'public_html' directory to your desired location. The included 'index.html' serves as a practical demonstration and starting point for its utilization.

3. **Setting Up for Desktop Application & Recompilation**:
    If your aim is to use SimGraphVisualizer as a desktop application or to recompile the source for any custom modifications, there are a few preliminary steps:

    - First, ensure you have `node.js` installed on your machine. It's a fundamental prerequisite.
    
    - Following that, you'll need to install any dependencies. This is accomplished via the npm (Node Package Manager) command:
      ```
      npm install
      ```

### Wrapping Up
SimGraphVisualizer, with its blend of functionality and flexibility, offers a unique proposition for those keen on Ising graph visualization. Whether you're using it in a browser or as a dedicated application, the process remains intuitive. Always refer back to this guide if you encounter any hiccups or need clarity on the steps. Happy visualizing!

## Using SimGraphVisualizer as a Standalone Application

### Building and Compilation Guide

**1. Pre-built Library**:
After fetching SimGraphVisualizer from the repository, you're all set to start using it. The reason being, it's delivered in a pre-compiled state, which eradicates the need for immediate compilation on the user's part.

**2. Recompilation and Running Desktop Application from Sources**:
However, if there's a specific requirement to recompile the library or if you're inclined to run the desktop application directly from the source files, follow these steps:

   - **Installing Node.js**: This is the foundational step. Ensure `node.js` is installed on your system. If not, it can be readily downloaded and installed from [Node.js official website](https://nodejs.org).

   - **Rebuilding the Library**: Post installation of `node.js`, you can proceed with the recompilation. Use the command:

```
     npm run build
```

     Alternatively, for those who have `gulp` installed on a global scale, use:
```
gulp build
```

**3. Running the Desktop Application**:
Want a quick spin of the desktop application? It's as simple as:
```
npm run start
```

**4. Compiling into an Executable File**:
For those wanting a standalone executable, employ:
```
npm run package
```

**5. Crafting an Installer**:
If your objective is to generate an installer for easier distribution or installation, the command is:
```
npm run make
```

### Final Thoughts

Using SimGraphVisualizer as a standalone application offers a dynamic experience, replete with the flexibility of custom recompilation and executable generation. This segment of the guide aids you in ensuring that the setup and execution process is as streamlined as possible. Dive in and explore the robust capabilities of SimGraphVisualizer!

## Integration with External Applications

### Running Concurrent Applications with Desktop Mode
The desktop version of SimGraphVisualizer is adept at launching other applications. This integration becomes particularly beneficial when you want to relay the state of the currently processed graph to these auxiliary apps. As these external applications operate, they might generate a modified or entirely new state of the graph. Upon completion, SimGraphVisualizer will readily display this updated state.

Further customization and specification of which external applications to run can be achieved through the dedicated settings window.

### The Settings Window Overview

**Availability**: As of now, the settings window is exclusively accessible in the desktop mode of SimGraphVisualizer.

**Functionality**: This window serves as the control center for establishing parameters concerning external applications that collaborate with SimGraphVisualizer. 

**User-defined Settings Storage**: Any configurations or settings determined by the user are safely stored in a text file. This file employs the JSON format, ensuring readability and easy future modifications.

**Visual Guide**: 
{image}
*Image Caption*: A glimpse of the program's configuration window.

### Closing Remarks
Harnessing the full potential of SimGraphVisualizer involves not just its standalone capabilities but also its proficiency in collaborating with other external applications. This seamless integration, backed by user-friendly configurations, ensures that users have a holistic experience, whether it's graph processing or interfacing with complementary apps.