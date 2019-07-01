# Create an Import

First of all, you need to create an import.
```javascript
const GNI = require('generic-node-importer');
```

## Create the Importer class

Inside the import, you must create the specific client importer class that extends `AbstractClientImporter`. From now we 
assume you created the `SpecificClientImporter` to implement the `AbstractClientImporter`.

For example:

```javascript
class SpecificClientImporter extends GNI.AbstractClientImporter {
   //The methods inside AbstractClientImporter will be introduced below
}
```

The `AbstractClientImporter` contains the following methods:
   - `constructor(options)`: This is a basic constructor that expect an `options` argument which will be available under
   the `options` property. You can put everything you wanted in order to be used in your specific implementation.
   - `load()`: This **abstract** method is dedicated to be used to load all client data. 
   There is only one requirement: **It must return a `Promise` that will be resolved when client data is fully loaded**
   
   For example: if you want to load a pattern `loadPois`:
   
   ```javascript
    load() {
        return new Promise(
        (resolve, reject)=>{
            setTimeout(() =>{
                this.loadPois();
                resolve("Success!");
            }, 250);
        }
    )}
   ```
   
   - `save(pattern)`: This methods is dedicated to be used into your `load()` implementation to save a client data formatted
   into our pattern schema. 
   
   For example: if you want to use save in the pattern `loadPois`, which is used above in `load()`:
   
   ```javascript
   save(e) {
        super.save(e);
   }
   loadPois() {
        const poi = new GNI.StorePattern();
        this.save(poi);
   }
   ```
   
   - `getSavedPatternBySignature(patternConstructor, signature)`: This methods can directly be used from library AbstractClientImporter.js and it is to retrieve an already saved pattern to be used in your `load()` implementation. This may be helpful when you need to add an already saved `CategoryPattern` to a `PoiPattern`.
   
   For example:
   
   ```javascript
   const place = this.getSavedPatternBySignature(GNI.PlacePattern, placeSignature);
  	if (place !== null) {
      poi.places.add(place);
   }
   ```
   
   - `_getUsedRepositoryNames(patternConstructor, signature)`: Is a private methods used on the `GenericImporter` to retrieve all repositories impacted
   by the `SpecificClientImporter`
   - `__getSavedPatternForRepository(repositoryName)`: Is a private methods used on the `GenericImporter` to retrieve all saved patterns
    of a repository.

## Pattern Schema

### AbstractPattern
Patterns are located into the _src/pattern_ directory. Each pattern implements the `AbstractPattern` which contains the 
following methods:
    - `static _getRepositoryName()`: methods used by `GenericImporter` to find out in which repository of the 
    _adsum-client-api_ to be used with this Pattern class.
    - `static _getEntityConstructor()`: methods used by `GenericImporter` to find out in which entity constructor of the 
    _adsum-client-api_ to be used with this Pattern class.
    - `static _getKeys()`: methods used by `GenericImporter` to find out in which keys are available on this Pattern class.
    
### Structure
Structure are located into the _src/pattern/structure_ directory. Structures aim to handle complexes relationships.

#### List
A `List` is an array of `AbstractPattern`. It's used to handle simple _toMany_ relationship between patterns. 

For example the `CategoryPattern#pois` field is a list, so if you wanted to add a `PoiPattern` to the `CategoryPattern` 
you just need to do:

```javascript
const poi = new PoiPattern();
const category = new CategoryPattern();

category.pois.add(poi);
```

#### List
A `List` is a sorted array of `AbstractPattern`. It's used to handle ordered _toMany_ relationship between patterns.

For example the `CategoryPattern#children` field is an ordered list, so if you wanted to add a children `CategoryPattern` 
to the parent one you just need to do:

```javascript
const parent = new CategoryPattern();
const child1 = new CategoryPattern();
const child2 = new CategoryPattern();

parent.children.add(child1, 1);
parent.children.add(child2, 2);
```

#### File
A `File` is a structure used to handle file reference. 

For example the `CategoryPattern#logo` field expected a `File`, so if you wanted to add a logo to the category you just 
need to do:

```javascript
const category = new CategoryPattern();
const logo = new File();
logo.uri = "http://fake.com/image.jpg";
logo.name = "The category logo";

category.logo = logo;
```

#### OrderedFileList
A `OrderedFileList` is a structure used to handle ordered _toMany_ file reference. 

For example the `PoiPattern#logos` field expected an `OrderedFileList`, so if you wanted to add a logo to the poi you just 
need to do:

```javascript
const poi = new PoiPattern();
const logo = new File();
logo.uri = "http://fake.com/image.jpg";
logo.name = "The category logo";

poi.logos.add(logo); // By default position=0
```

## Implementing the AbstractClientImporter#load() method

The only required operation here is the `AbstractClientImporter#save(pattern)` method. 
    - You must save all used pattern only __ONCE TIME__. This means if your client data api requires to edit an already 
    saved pattern you couldn't create a new pattern with same signature, you have to call
     `getSavedPatternBySignature(patternConstructor, signature)` like this `const poi = this.getSavedPatternBySignature(PoiPattern, "42")`
    - By default, all patterns attributes are set to `undefined` meaning the key will be ignored by `GenericImporter`. So
    the current ADSUM value will be kept.

> Note: the signature field is required, this is a unique identifier used to match our entity identifier with the client
identifier.

## Entry Point

The entry point is the file that will be run to execute the import. You just need to:
    - Create an `ACA.EntityManager` instance called `em`
    - Create an `SpecificClientImporter` instance called `specificImporter`
    - Create an instance of `GenericImporter` called `genericImporter` with `em` and `specificImporter` as arguments.
    - Call `genericImporter.run()` which return a Promise fulfilled when import is finished.

```javascript
const SpecificImporter = require('./src/client/Specific/SpecificImporter');
const GenericImporter = require('./src/GenericImporter');
const ACA = require('adsum-client-api');

// //load Adsum Data
const config = new ACA.Options();
config.endpoint = 'https://dev-api.adsum.io/';
config.site = 304;
config.username = '321-device';
config.key = '0bff04dee4d816c6a261253b111a17bd66897d6a0806c563c5e6374dbd3b7e81';
const em = new ACA.EntityManager(config);

const specificImporter = new SpecificImporter({});

const genericImporter = new GenericImporter(em, specificImporter);
genericImporter.run();
```
## Generic Importer

The `GenericImporter` will treat all patterns saved. The saved patterns will trigger the following changes:
- KEPT: The entity remain unchanged as there is no change detected
- CREATE: The entity is created as the pattern is new
- UPDATE: The entity is updated as there is changes detected

After treating all saved patterns, all entities with a signature which wasn't saved will be REMOVED.

All entities without signature will be ignored as there are not managed by the importer.


## Known issues

- There is no way to remove ignored entities (the one without signature).
- If you don't save any pattern of a repository, this repository is ignored. So an edge case were all entities of a 
repository has been deleted from client data api will not be repercuted in our data model. For example, if you doesn't 
save any `CategoryPattern`, categories are considered ignored instead of removing all entities.
- The diff report is not perfect.


