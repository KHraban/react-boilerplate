import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from './App';

configure({ adapter: new Adapter() });

test('App.tsx renders header element with text', () => {
  const name = 'enzyme test';
  const app = shallow(<App name={name} />);
  expect(app.find('h1').text()).toEqual(`Hello from ${name}`);
});

test('App.tsx renders image element with file and style stubs', () => {
  const app = shallow(<App name="test" />);
  const img = app.find('img');
  expect(img.prop('src')).toEqual('test-file-stub');
  expect(img.hasClass('logo'));
});
